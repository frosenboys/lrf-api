import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn Sếp', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'NewPass123', description: 'Gửi lên nếu muốn đổi mật khẩu', required: false })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  password?: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.SUPER_ADMIN, required: false })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @ApiProperty({ example: true, description: 'True: Hoạt động, False: Khóa', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}