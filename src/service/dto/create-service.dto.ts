import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Moshina, Uy, ofice', description: 'Xizmat nomi' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
