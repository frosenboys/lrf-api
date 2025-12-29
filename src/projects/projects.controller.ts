import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiHeaders } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { AtGuard } from 'src/auth/at.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  // CREATE PROJECT
  @Post()
  @ApiBearerAuth()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Create Project (Moderator)' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  // GET ALL PROJECTS WITH PAGINATION AND OPTIONAL STATUS FILTER
  @Get()
  @ApiOperation({ summary: 'Get list of projects (Paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', enum: ProjectStatus, required: false })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: ProjectStatus,
  ) {
    return this.projectsService.findAll(+page, +limit, status);
  }

  // GET PROJECT BY SLUG
  @Get(':slug')
  @ApiOperation({ summary: 'Get project details by Slug' })
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findOne(slug);
  }

  // UPDATE PROJECT
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Update / Hide project (Moderator)' })
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  // DELETE PROJECT
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Delete project (Moderator)' })
  remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }
}