import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AtGuard } from './at.guard';
import { RtGuard } from './rt.guard';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators/get-current-user.decorator';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AdminRole } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // LOGOUT
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  // REFRESH TOKEN
  @ApiBearerAuth()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // GET PROFILE 
  @ApiBearerAuth()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(AdminRole.EDITOR)
  @Get('profile')
  async getProfile(@GetCurrentUserId() userId: number) {
    return this.authService.getProfile(userId);
  }
}