import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Sobir', description: 'Customer Ismi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Customer elektron pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'Customer password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'confirm_password',
    description: 'Customer password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_password: string;

  @ApiProperty({
    example: 'phone number',
    description: 'Customer password',
  })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    example: "O'zbekiston, Toshken, Chilonzor, 9-daha, dom-2, podyezd-1",
    description: 'Customer address',
  })
  @IsNotEmpty()
  address: string;
}
