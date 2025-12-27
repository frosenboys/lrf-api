import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContactStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  // CREATE CONTACT MESSAGE (PUBLIC)
  @Post()
  @ApiOperation({ summary: 'Submit contact form (Public)' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  // GET ALL CONTACTS (EDITOR)
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.EDITOR)
  @ApiOperation({ summary: 'Get list of contacts (Editor)' })
  @ApiQuery({ name: 'status', enum: ContactStatus, required: false })
  findAll(@Query('status') status?: ContactStatus) {
    return this.contactsService.findAll(status);
  }

  // GET CONTACT DETAILS (EDITOR)
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.EDITOR)
  @ApiOperation({ summary: 'Get contact details (Editor)' })
  findOne(@Param('id') id: number) {
    return this.contactsService.findOne(id);
  }

  // UPDATE CONTACT STATUS (EDITOR)
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.EDITOR)
  @ApiOperation({ summary: 'Update contact status (Editor)' })
  update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  // DELETE CONTACT (EDITOR)
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.EDITOR)
  @ApiOperation({ summary: 'Delete contact (Editor)' })
  remove(@Param('id') id: number) {
    return this.contactsService.remove(id);
  }
}