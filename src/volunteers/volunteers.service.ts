import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { VolunteerStatus } from '@prisma/client';

@Injectable()
export class VolunteersService {
  constructor(private prisma: PrismaService) { }

  // REGISTER VOLUNTEER (Public)
  async create(createVolunteerDto: CreateVolunteerDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: createVolunteerDto.projectId },
    });
    if (!project) throw new NotFoundException('Dự án không tồn tại.');

    return this.prisma.volunteer.create({
      data: createVolunteerDto,
    });
  }

  // GET VOLUNTEERS LIST (Admin)
  async findAll(projectId?: number, status?: VolunteerStatus) {
    const whereCondition = {
      ...(projectId ? { projectId } : {}),
      ...(status ? { status } : {}),
    };

    return this.prisma.volunteer.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { title: true } },
      },
    });
  }

  // UPDATE VOLUNTEER STATUS (Admin)
  async update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
    const volunteer = await this.prisma.volunteer.findUnique({ where: { id } });
    if (!volunteer) throw new NotFoundException('Không tìm thấy đơn đăng ký.');

    return this.prisma.volunteer.update({
      where: { id },
      data: { status: updateVolunteerDto.status },
    });
  }

  // DELETE VOLUNTEER APPLICATION (Admin)
  async remove(id: number) {
    const volunteer = await this.prisma.volunteer.findUnique({ where: { id } });
    if (!volunteer) throw new NotFoundException('Không tìm thấy đơn đăng ký.');

    return this.prisma.volunteer.delete({ where: { id } });
  }
}