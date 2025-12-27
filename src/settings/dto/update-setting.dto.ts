import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'Little Roses Foundation', required: false })
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiProperty({
    example: {
      facebook: 'https://fb.com/lrf',
      zalo: '0909...',
      bannerUrl: 'http://...',
      maintenanceMode: false
    },
    description: 'Chứa các cấu hình linh hoạt (Social, Color, Toggle features...)'
  })
  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}