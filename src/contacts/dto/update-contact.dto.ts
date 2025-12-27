import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty({ enum: ContactStatus, example: ContactStatus.REPLIED })
  @IsEnum(ContactStatus, { message: 'Trạng thái không hợp lệ' })
  @IsNotEmpty()
  status: ContactStatus;

  @ApiProperty({ example: 'Đã gửi email phản hồi ngày 20/12...', required: false })
  @IsString()
  @IsOptional()
  replyMessage?: string;
}