import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SePayWebhookDto {
  @ApiProperty({ example: 92704 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Vietcombank' })
  @IsString()
  gateway: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: '2023-03-25 14:02:37' })
  @IsString()
  transactionDate: string;

  @ApiProperty({ example: 'XTXT_1' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'in' })
  @IsString()
  transferType: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  transferAmount: number;

  @ApiProperty({ required: false, example: 'SP_92704' })
  @IsString()
  @IsOptional()
  code?: string;
}