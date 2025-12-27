import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';
import defaultSlugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  // GENERATE SLUG FUNCTION
  private generateSlug(text: string): string {
    return defaultSlugify(text, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }

  private generatePName(slug: string): string {
    if (!slug) return '';
    const parts = slug.split('-');

    const shortCode = parts.map(part => {
      if (!isNaN(Number(part))) return part;
      return part.charAt(0).toUpperCase();
    }).join('');

    return shortCode;
  }

  // CREATE PROJECT
  async create(createProjectDto: CreateProjectDto) {
    const { images, ...projectData } = createProjectDto;

    const slug = this.generateSlug(projectData.title);
    const p_name = this.generatePName(slug);
    const existing = await this.prisma.project.findFirst({
      where: {
        OR: [
          { slug: slug },
          { p_name: p_name }
        ]
      }
    });

    if (existing) {
      throw new BadRequestException('Dự án này đã tồn tại (trùng tên hoặc mã dự án).');
    }

    return this.prisma.project.create({
      data: {
        ...projectData,
        slug,
        p_name,
        images: {
          create: images || [],
        },
      },
      include: {
        images: true,
      },
    });
  }

  // GET ALL PROJECTS WITH PAGINATION AND OPTIONAL STATUS FILTER
  async findAll(page: number = 1, limit: number = 10, status?: ProjectStatus) {
    const skip = (page - 1) * limit;

    const whereCondition = status ? { status } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
        },
      }),
      this.prisma.project.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // GET PROJECT BY SLUG
  async findOne(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        donations: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
    });

    if (!project) throw new NotFoundException('Không tìm thấy dự án.');

    return project;
  }

  // UPDATE PROJECT
  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { images, ...updateData } = updateProjectDto;

    let slug = undefined;
    if (updateData.title) {
      let slug = this.generateSlug(updateData.title);
      const existing = await this.prisma.project.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Tên dự án mới bị trùng.');
      }
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(slug ? { slug } : {}),
        ...(images && {
          images: {
            deleteMany: {},
            create: images
          }
        })
      },
    });
  }

  // DELETE PROJECT
  async remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}