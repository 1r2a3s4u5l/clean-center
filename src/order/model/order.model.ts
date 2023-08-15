import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from '../../customer/model/customer.model';
import { Service_Employer } from '../../service_employer/model/service_employer.model';

interface OrderAttrs {
  name: string;
  card_pay: string;
  customerId: number;
  service_employerId: number;
  description: string;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderAttrs> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'order name', description: 'Xizmat nomi' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 'card number', description: 'Xizmat xaqi' })
  @Column({
    type: DataType.STRING,
  })
  card_pay: string;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Customer Id',
  })
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  customerId: number;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Service_Employer Id',
  })
  @ForeignKey(() => Service_Employer)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
  })
  service_employerId: number;

  @ApiProperty({
    example: 'yoqdi',
    description: 'Xizmat yoqganini yoki yoqmaganini kiritish',
  })
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @BelongsTo(() => Customer)
  customer: Customer[];

  @BelongsTo(() => Service_Employer)
  service_employer: Service_Employer[];
}
