import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostType } from '@prisma/client';
import defaultSlugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  private generateSlug(text: string): string {
    return defaultSlugify(text, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }

  // CREATE POST
  async create(createPostDto: CreatePostDto) {
    const slug = this.generateSlug(createPostDto.title);

    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (existing) throw new BadRequestException('Tiêu đề bài viết đã tồn tại (trùng slug).');

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        slug,
      },
    });
  }

  // GET ALL POSTS
  async findAll(categoryId?: string, type?: PostType, projectId?: string) {
    const whereCondition: any = { isPublished: true }; // Mặc định chỉ lấy bài đã public

    if (categoryId) whereCondition.categoryId = categoryId;
    if (type) whereCondition.type = type;
    if (projectId) whereCondition.projectId = projectId;

    return this.prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, slug: true } }, // Lấy tên danh mục
      },
    });
  }

  // GET ONE POST BY SLUG
  async findOne(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        project: { select: { title: true, slug: true } },
      },
    });
    if (!post) throw new NotFoundException('Bài viết không tồn tại.');
    return post;
  }

  // UPDATE POST
  async update(id: number, updatePostDto: UpdatePostDto) {
    let slug = undefined;
    if (updatePostDto.title) {
      let slug = this.generateSlug(updatePostDto.title);
      const existing = await this.prisma.post.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Tiêu đề mới bị trùng slug.');
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
        ...(slug ? { slug } : {}),
      },
    });
  }

  // DELETE POST
  async remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }

  // DOWNLOAD DOCUMENT (Increment download count + Return link)
  async downloadDocument(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || !post.attachmentUrl) {
      throw new NotFoundException('Không tìm thấy tài liệu để tải.');
    }

    await this.prisma.post.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    return {
      url: post.attachmentUrl,
      fileName: post.title
    };
  }
}