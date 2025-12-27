import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VolunteerStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Volunteers')
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) { }

  @Post()
  @ApiOperation({ summary: 'Register as a volunteer (Public)' })
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.create(createVolunteerDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Get list of volunteers (Moderator)' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'status', enum: VolunteerStatus, required: false })
  findAll(
    @Query('projectId') projectId?: number,
    @Query('status') status?: VolunteerStatus,
  ) {
    return this.volunteersService.findAll(projectId, status);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Approve or Reject application (Moderator)' })
  update(@Param('id') id: number, @Body() updateVolunteerDto: UpdateVolunteerDto) {
    return this.volunteersService.update(id, updateVolunteerDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Delete application (Moderator)' })
  remove(@Param('id') id: number) {
    return this.volunteersService.remove(id);
  }
}