import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Login
export class LoginDto {
  @ApiProperty({ example: 'admin@lrf.org.vn', description: 'Email của người dùng' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Admin@123', description: 'Mật khẩu của người dùng' })
  @IsString()
  @MinLength(6)
  password: string;
}