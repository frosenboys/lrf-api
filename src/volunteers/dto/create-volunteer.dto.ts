import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVolunteerDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0909123456' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ example: 'Chụp ảnh, dạy tiếng Anh...', required: false })
  @IsString()
  @IsOptional()
  skills?: string;

  @ApiProperty({ example: 'uuid-project-id', description: 'ID của dự án' })
  @IsUUID('4', { message: 'ID dự án không hợp lệ' })
  @IsNotEmpty()
  projectId: number;
}