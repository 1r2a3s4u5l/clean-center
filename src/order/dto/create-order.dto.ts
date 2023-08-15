import { ApiProperty } from '@nestjs/swagger';
import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'order name', description: 'Xizmat nomi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'card name', description: 'Xizmat xaqi' })
  //   @IsCreditCard()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  card_pay: string;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Customer Id',
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Service_Employer Id',
  })
  @IsNumber()
  service_employerId: number;

  @ApiProperty({
    example: 'yoqdi',
    description: 'Xizmat yoqganini yoki yoqmaganini kiritish',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
