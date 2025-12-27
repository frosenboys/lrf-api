import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Posts (News & Documents)')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Create Post (Moderator)' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Posts (Public)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'type', enum: PostType, required: false })
  @ApiQuery({ name: 'projectId', required: false })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: PostType,
    @Query('projectId') projectId?: string,
  ) {
    return this.postsService.findAll(categoryId, type, projectId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get One Post By Slug (Public)' })
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Update Post (Moderator)' })
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.MODERATOR)
  @ApiOperation({ summary: 'Delete Post (Moderator)' })
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Download Document (Public)' })
  download(@Param('id') id: number) {
    return this.postsService.downloadDocument(id);
  }
}