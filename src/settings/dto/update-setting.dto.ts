import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'Little Roses Foundation', required: false })
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiProperty({ example: 'my-cloudinary-key', required: false })
  @IsOptional()
  @IsString()
  CloudinaryAPIKey?: string;

  @ApiProperty({ example: 'my-cloudinary-secret', required: false })
  @IsOptional()
  @IsString()
  CloudinaryAPISecret?: string;

  @ApiProperty({ example: 'my-cloudinary-name', required: false })
  @IsOptional()
  @IsString()
  CloudinaryCloudName?: string;

  @ApiProperty({ example: 'my-sepay-api-key', required: false })
  @IsOptional()
  @IsString()
  SepayAPIKey?: string;

  @ApiProperty({ example: 'compact2', required: false })
  @IsOptional()
  @IsString()
  bankQRTemplate?: string;


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
  metaData?: Record<string, any>;
}