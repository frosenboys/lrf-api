import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';
import defaultSlugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  private generateSlug(text: string): string {
    return defaultSlugify(text, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }

  // CREATE CATEGORY
  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.generateSlug(createCategoryDto.name);

    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [
          { slug: slug },
        ]
      }
    });

    if (existing) {
      throw new BadRequestException('Danh mục này đã tồn tại (trùng tên hoặc mã chuyển khoản).');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });
  }

  // GET ALL
  async findAll(type?: CategoryType) {
    return this.prisma.category.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET ONE
  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    return category;
  }

  // UPDATE
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const dataToUpdate: any = { ...updateCategoryDto };

    if (updateCategoryDto.name) {
      const newSlug = this.generateSlug(updateCategoryDto.name);

      const existing = await this.prisma.category.findFirst({
        where: {
          OR: [{ slug: newSlug }],
          NOT: { id: id }
        }
      });

      if (existing) {
        throw new BadRequestException('Tên danh mục mới bị trùng với danh mục khác.');
      }

      dataToUpdate.slug = newSlug;
    }

    return this.prisma.category.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    return this.prisma.category.delete({ where: { slug } });
  }
}