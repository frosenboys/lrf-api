import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Min
} from 'class-validator';

class ProjectImageDto {
  @ApiProperty({ example: 'https://cloudinary.com/img1.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'Hoạt động trao quà', required: false })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Tiếp Sức Đến Trường 2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Tóm tắt ngắn gọn...', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ example: '<p>Nội dung HTML...</p>', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 'https://cloudinary.com/thumb.jpg', required: false })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'https://drive.google.com/file.pdf', required: false })
  @IsString()
  @IsOptional()
  documentUrl?: string;

  @ApiProperty({ example: 50000000 })
  @IsNumber()
  @Min(0)
  targetAmount: number;

  @ApiProperty({ example: '2025-11-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2026-05-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ example: 'uuid-category-id' })
  @IsString()
  @IsNotEmpty()
  categoryId: number;

  // --- Process Images (Gallery) ---
  @ApiProperty({ type: [ProjectImageDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];
}