import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async getTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'AT-SECRET-KEY',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'RT-SECRET-KEY',
        expiresIn: '2d',
      }),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.admin.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    if (!user.isActive) throw new ForbiddenException('Tài khoản đã bị khóa.');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // LOGOUT
  async logout(userId: number) {
    await this.prisma.admin.updateMany({
      where: { id: userId, hashedRefreshToken: { not: null } },
      data: { hashedRefreshToken: null },
    });
    return true;
  }

  // REFRESH TOKEN
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.admin.findUnique({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // GET PROFILE
  async getProfile(userId: number) {
    return this.prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}