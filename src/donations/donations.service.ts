import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { SePayWebhookDto } from './dto/sepay-donation.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) { }

  async getBankList() {
    try {
      const res = await firstValueFrom(this.httpService.get('https://api.vietqr.io/v2/banks'));
      return res.data;
    } catch (e) {
      return { code: '99', data: [] };
    }
  }

  async getBankingInfo(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug: slug },
      select: {
        id: true,
        p_name: true,
        categoryId: true,
      },

    });

    if (!project) throw new NotFoundException('Dự án không tồn tại');

    const settings = await this.prisma.systemSetting.findFirst();
    if (!settings || !settings.options) throw new BadRequestException('Lỗi cấu hình bank');
    const bankConfig = settings.options as any;

    const p_name = project.p_name;
    const categoryId = project.categoryId || 0;
    const transferContent = `${categoryId}${p_name}`;

    return {
      bankName: bankConfig.bankName,
      bankBin: bankConfig.bankBin,
      bankQRTemplate: bankConfig.qrTemplate,
      bankAccount: bankConfig.bankAccount,
      bankAccountName: bankConfig.bankAccountName,
      transferContent: transferContent,
    };
  }

  async processWebhook(dto: SePayWebhookDto) {
    if (dto.transferType !== 'in') return { success: true, message: 'Ignored outbound' };

    const exists = await this.prisma.donation.findUnique({
      where: { gatewayTransactionId: dto.id.toString() },
    });
    if (exists) return { success: true, message: 'Already processed' };

    // Parse content to find project
    // Format: (CATEGORYID)(PROJECTNAME) [message]
    const content = dto.content.trim();
    const regex = /^(\d+)([a-zA-Z0-9]+)/;
    const match = content.match(regex);

    let foundProjectId: number | null = null;

    let finalMessage: string | null = dto.content;

    if (match) {
      const catId = parseInt(match[1]);
      const pName = match[2].toUpperCase();
      const fullCode = match[0];

      const project = await this.prisma.project.findFirst({
        where: { p_name: pName, categoryId: catId },
        select: { id: true }
      });

      if (project) {
        foundProjectId = project.id;

        const extractedMsg = content.substring(fullCode.length).trim();

        if (extractedMsg.length > 0) {
          finalMessage = extractedMsg;
        } else {
          finalMessage = null;
        }
      }
    }

    // Transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.donation.create({
        data: {
          amount: dto.transferAmount,
          donorName: dto.gateway + ' ' + dto.accountNumber,

          message: finalMessage,

          paymentCode: dto.code || `${dto.id}`,
          gatewayTransactionId: dto.id.toString(),
          projectId: foundProjectId,
        },
      });

      if (foundProjectId) {
        await tx.project.update({
          where: { id: foundProjectId },
          data: { currentAmount: { increment: dto.transferAmount } }
        });
      }
    });

    return { success: true, projectId: foundProjectId };
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