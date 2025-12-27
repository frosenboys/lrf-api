import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('👥 Users (Admin Management)')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // CREATE USER
  @Post()
  @ApiOperation({ summary: 'Create new staff account' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET ALL USERS
  @Get()
  @ApiOperation({ summary: 'Get list of admins/staff' })
  findAll() {
    return this.usersService.findAll();
  }

  // GET USER DETAILS
  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // UPDATE USER
  @Patch(':id')
  @ApiOperation({ summary: 'Update info / Change password / Block user' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE USER
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}