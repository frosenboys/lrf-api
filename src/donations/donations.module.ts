import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { BullModule } from '@nestjs/bull';
import { DonationProcessor } from './donations.processor';

@Module({
  imports: [HttpModule, BullModule.registerQueue({
    name: 'donation-queue',
  })],
  controllers: [DonationsController],
  providers: [DonationsService, DonationProcessor],
})
export class DonationsModule { }