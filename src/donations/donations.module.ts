import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';

@Module({
  imports: [HttpModule],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule { }