import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Order } from '../../order/model/order.model';
import { Service_Employer } from '../../service_employer/model/service_employer.model';

interface CustomerAttrs {
  name: string;
  phone_number: string;
  address: string;
  email: string;
  hashed_password: string;
  is_active: boolean;
  hashed_refresh_token: string;
}

@Table({ tableName: 'customer' })
export class Customer extends Model<Customer, CustomerAttrs> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Sobir', description: 'Customer Ismi' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({
    example: 'email1@mail.uz',
    description: 'Customer elektron pochtasi',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @ApiProperty({ example: 'Uzbek!$t0n', description: 'Customer password' })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Customer phone number',
  })
  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @ApiProperty({
    example: "O'zbekiston, Toshken, Chilonzor, 9-daha, dom-2, podyezd-1",
    description: 'Customer address',
  })
  @Column({
    type: DataType.STRING,
  })
  address: string;

  @ApiProperty({
    example: 'false | true',
    description: 'Customer tastiqlangan holati',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: Boolean;

  @ApiProperty({ example: 'token', description: 'Customer tokeni' })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @BelongsToMany(() => Service_Employer, () => Order)
  service_employer: Service_Employer[];
}
