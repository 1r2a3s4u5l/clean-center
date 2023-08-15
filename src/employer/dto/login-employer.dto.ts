import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginEmployerrDto {
  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Employer elekton pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Employer paroli',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
