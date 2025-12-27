import { ApiProperty } from '@nestjs/swagger';
import { VolunteerStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateVolunteerDto {
  @ApiProperty({ enum: VolunteerStatus, example: VolunteerStatus.APPROVED })
  @IsEnum(VolunteerStatus, { message: 'Trạng thái không hợp lệ' })
  @IsNotEmpty()
  status: VolunteerStatus;
}