import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { SePayWebhookDto } from './dto/sepay-donation.dto';
import { CreateDonationDTO } from './dto/create-donation.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('💰 Donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Get('banks')
  @ApiOperation({ summary: 'Lấy danh sách ngân hàng (VietQR)' })
  getBanks() {
    return this.donationsService.getBankList();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Donation Pending' })
  createDonation(@Body() dto: CreateDonationDTO) {
    return this.donationsService.createDonation(dto);
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'Get donations list (Transparency)' })
  @ApiQuery({ name: 'projectId', required: false })
  findAll(@Param('slug') slug: string) {
    return this.donationsService.findAll(slug);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'SePay CallBack' })
  webhook(@Body() dto: SePayWebhookDto) {
    if (!dto) throw new Error('No data');
    return this.donationsService.processWebhook(dto);
  }


}