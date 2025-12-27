import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactStatus } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) { }

  // CREATE CONTACT MESSAGE (PUBLIC)
  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  // GET ALL CONTACTS (ADMIN)
  async findAll(status?: ContactStatus) {
    const whereCondition = {
      ...(status ? { status } : {}),
    };

    return this.prisma.contact.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET CONTACT DETAILS (ADMIN)
  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Không tìm thấy tin nhắn liên hệ này.');
    }
    return contact;
  }

  // UPDATE CONTACT STATUS (ADMIN)
  async update(id: number, updateContactDto: UpdateContactDto) {
    await this.findOne(id);

    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  // DELETE CONTACT (ADMIN)
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.contact.delete({
      where: { id },
    });
  }
}