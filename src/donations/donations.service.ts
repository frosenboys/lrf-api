import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { SePayWebhookDto } from './dto/sepay-donation.dto';
import { CreateDonationDTO } from './dto/create-donation.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { firstValueFrom } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @InjectQueue('donation-queue') private donationQueue: Queue,
    private eventsGateway: EventsGateway
  ) { }

  async getBankList() {
    try {
      const res = await firstValueFrom(this.httpService.get('https://api.vietqr.io/v2/banks'));
      return res.data;
    } catch (e) {
      return { code: '99', data: [] };
    }
  }

  async createDonation(dto: CreateDonationDTO) {
    // Check project exists
    const project = await this.prisma.project.findUnique({
      where: { id: dto.project_id },
      select: {
        id: true,
        bankName: true,
        bankBin: true,
        bankAccount: true,
        bankOwner: true,
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    // LRF (space) <random 5 chars>
    const syntax = 'LRF';
    const transID = Math.random().toString(36).substring(2, 7).toUpperCase();
    const transactionCode = `${syntax} ${transID}`;
    const newDonation = await this.prisma.donation.create({
      data: {
        amount: 0,
        donorName: dto.donorName || 'Người quyên góp',
        projectId: dto.project_id,
        message: null,
        paymentCode: transID,
      },
    });

    try {
      await this.donationQueue.add(
        'check-timeout',
        { donationId: newDonation.id },
        {
          delay: 5 * 60 * 1000,
          removeOnComplete: true
        }
      );
    } catch (e) {
      console.error('Failed to enqueue donation timeout job', e);
    }

    // Get banking info from system settings
    const setting = await this.prisma.systemSetting.findFirst({
      select: { bankQRTemplate: true },
    }) || { bankQRTemplate: '' };
    const vietqrUrl = "https://img.vietqr.io/image/" + `${project.bankBin}-${project.bankAccount}-${setting.bankQRTemplate}.png` +
      `?addInfo=${encodeURIComponent(transactionCode)}`;
    return {
      transactionCode: transactionCode,
      bankName: project.bankName,
      bankAccount: project.bankAccount,
      bankOwner: project.bankOwner,
      qrUrl: vietqrUrl,
      projectId: project.id,
    };
  }


  async processWebhook(dto: SePayWebhookDto) {
    if (dto.transferType !== 'in') return { success: true, message: 'Ignored outbound' };

    // Parse content to find project
    // Format: LRF <RandomCode5Char> (message)
    const content = dto.content.trim();
    const regex = /LRF\s+([a-zA-Z0-9]{5})\s*(.*)/i;
    const match = content.match(regex);

    if (!match) throw new BadRequestException('Invalid content format');

    const transactionCode = match[1].toUpperCase();
    const message = match[2] ? match[2].trim() : '';

    // Find donations by transactionCode
    const donation = await this.prisma.donation.findFirst({
      where: { paymentCode: transactionCode },
      select: { id: true, projectId: true, status: true, gatewayTransactionId: true },
    });
    if (!donation || donation.status === 'SUCCESS' || donation.gatewayTransactionId != null) {
      throw new BadRequestException('Donation with this transaction code not found or already processed');
    }

    const projectId = donation.projectId;
    if (projectId == null) {
      throw new BadRequestException('Transaction code is not linked to a project');
    }

    const project = await this.prisma.project.findFirst({
      where: { id: projectId },
      select: { id: true }
    });
    if (!project) {
      throw new BadRequestException('Project linked to transaction code not found');
    }

    // Transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.donation.update({
        where: { id: donation.id },
        data: {
          amount: dto.transferAmount,

          message: message,
          gatewayTransactionId: dto.id.toString(),
          status: 'SUCCESS',
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { currentAmount: { increment: dto.transferAmount } }
      });
    });

    this.eventsGateway.broadcastDonation({
      amount: dto.transferAmount,
      message: message,
      donorName: 'Mạnh Thường Quân',
      projectTitle: projectId,
      transactionCode: `LRF ${transactionCode}`,
    });

    return { success: true, projectId: projectId };
  }

  async findAll(slug: string) {
    return this.prisma.donation.findMany({
      where: {
        project: { slug: slug },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        project: { select: { title: true } },
      },
    });
  }
}