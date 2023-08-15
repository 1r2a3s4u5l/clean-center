import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminrDto {
  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Foydalanuvchi elekton pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Foydalanuvchi paroli',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
