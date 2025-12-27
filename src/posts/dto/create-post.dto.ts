import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Báo cáo tài chính Quý 1/2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Tóm tắt nội dung...', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ example: '<p>Nội dung chi tiết...</p>', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 'https://cloudinary.com/thumb.jpg', required: false })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'https://drive.google.com/report.pdf', description: 'Link file tài liệu (nếu có)', required: false })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ApiProperty({ enum: PostType, example: PostType.NEWS })
  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType; // NEWS, STORY, REPORT, DOCUMENT

  @ApiProperty({ example: 'id', required: false })
  @IsString()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 'id', description: 'Nếu bài viết này thuộc về 1 dự án cụ thể', required: false })
  @IsString()
  @IsOptional()
  projectId?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}