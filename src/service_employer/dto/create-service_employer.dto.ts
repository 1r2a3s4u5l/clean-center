import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceEmployerDto {
  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'service Id',
  })
  @IsNumber()
  serviceId: number;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'employer Id',
  })
  @IsNumber()
  employerId: number;

  @ApiProperty({ example: 100_000, description: 'fee for work done' })
  @IsNumber()
  total_amount: number;
  
}
