import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('📂 Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // CREATE CATEGORY
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Create category (Moderator)' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET ALL CATEGORIES WITH OPTIONAL TYPE FILTER
  @Get()
  @ApiOperation({ summary: 'Get all categories (Public)' })
  @ApiQuery({ name: 'type', enum: CategoryType, required: false, description: 'Filter by PROJECT or POST' })
  findAll(@Query('type') type?: CategoryType) {
    return this.categoriesService.findAll(type);
  }

  // GET CATEGORY DETAILS
  @Get(':slug')
  @ApiOperation({ summary: 'Get category details' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  // UPDATE CATEGORY
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Update category (Moderator)' })
  update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE CATEGORY
  @Delete(':slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete category (Super Admin)' })
  remove(@Param('slug') slug: string) {
    return this.categoriesService.remove(slug);
  }
}