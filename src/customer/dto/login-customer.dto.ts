import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCustomerrDto {
  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Customer elekton pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Customer paroli',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
