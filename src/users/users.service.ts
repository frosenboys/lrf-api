import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // CREATE USER
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.admin.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Save to DB
    const user = await this.prisma.admin.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  // GET ALL USERS
  async findAll() {
    return this.prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  // GET ONE USER
  async findOne(id: number) {
    const user = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản.');

    const { password, ...result } = user;
    return result;
  }

  // UPDATE USER
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.admin.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản.');

    const updateData: any = { ...updateUserDto };

    // If updating password -> Hash it again
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.prisma.admin.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  // DELETE USER
  async remove(id: number) {
    return this.prisma.admin.delete({
      where: { id },
    });
  }
}