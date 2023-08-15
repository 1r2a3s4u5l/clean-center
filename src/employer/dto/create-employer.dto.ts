import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateEmployerDto {
  @ApiProperty({ example: 'Sobir', description: 'Employer Ismi' })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Employer elektron pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'Employer password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'confirm_password',
    description: 'Employer password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_password: string;

  @ApiProperty({
    example: 'phone number',
    description: 'Employer password',
  })
  @IsPhoneNumber()
  phone_number: string;
}
