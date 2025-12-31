import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDonationDTO {
  @ApiProperty({ example: "Nguyen Van A" })
  @IsString()
  donorName: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  project_id: number;
}