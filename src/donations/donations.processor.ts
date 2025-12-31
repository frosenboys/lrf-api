import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('donation-queue')
export class DonationProcessor {
  private readonly logger = new Logger(DonationProcessor.name);

  constructor(private readonly prisma: PrismaService) { }

  @Process('check-timeout')
  async handleTimeout(job: Job<{ donationId: number }>) {
    const { donationId } = job.data;

    // Check existing donation
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!donation) return;

    // Only DELETE if status is still PENDING
    if (donation.status === 'PENDING') {
      try {
        await this.prisma.donation.delete({
          where: { id: donationId },
        });
      } catch (error) {
        this.logger.error(`Error deleting donation ${donationId}`, error);
      }
    }
  }
}