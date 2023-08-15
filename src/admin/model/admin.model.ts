import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, Model } from 'sequelize-typescript';

interface AdminAttrs {
  name: string;
  email: string;
  hashed_password: string;
  is_active: boolean;
  is_creator: boolean;
  hashed_refresh_token: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminAttrs> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Sobir', description: 'Admin Ismi' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 'Uzbek!$t0n', description: 'Admin password' })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Admin elektron pochtasi',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'false | true',
    description: 'Admin tastiqlangan holati',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: Boolean;

  @ApiProperty({
    example: 'false | true',
    description: 'Admin ozgartirish',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_creator: Boolean;

  @ApiProperty({ example: 'token', description: 'Admin tokeni' })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;
}
