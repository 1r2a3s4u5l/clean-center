import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { Service } from '../../service/model/service.model';
import { Service_Employer } from '../../service_employer/model/service_employer.model';

interface EmployerAttrs {
  name: string;
  email: string;
  hashed_password: string;
  phone_number: string;
  is_active: boolean;
  hashed_refresh_token: string;
}

@Table({ tableName: 'employer' })
export class Employer extends Model<Employer, EmployerAttrs> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Sobir', description: 'Employer Ismi' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Employer elektron pochtasi',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @ApiProperty({ example: 'Uzbek!$t0n', description: 'Employer password' })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Employer phone number',
  })
  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @ApiProperty({
    example: 'false | true',
    description: 'Employer tastiqlangan holati',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: Boolean;

  @ApiProperty({ example: 'token', description: 'Employer tokeni' })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;
  @BelongsToMany(() => Service, () => Service_Employer)
  services: Service[];


}
