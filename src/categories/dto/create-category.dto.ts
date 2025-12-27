import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Giáo Dục', description: 'Tên danh mục' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: CategoryType,
    example: CategoryType.PROJECT,
    description: 'Loại danh mục: PROJECT hoặc POST'
  })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;

  @ApiProperty({ example: 'Các dự án hỗ trợ học tập', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}