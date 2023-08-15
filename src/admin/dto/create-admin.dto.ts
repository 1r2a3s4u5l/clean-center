import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Sobir', description: 'Foydalanuvchi Ismi' })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Foydalanuvchi elektron pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'Foydalanuvchi password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'confirm_password',
    description: 'Foydalanuvchi password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_password: string;
}
