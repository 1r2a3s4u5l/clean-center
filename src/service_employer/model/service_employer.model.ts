import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Service } from '../../service/model/service.model';
import { Employer } from '../../employer/model/employer.model';
import { Order } from '../../order/model/order.model';
import { Customer } from '../../customer/model/customer.model';

interface Service_employerAttrs {
  serviceId: number;
  employerId: number;
  total_amount: number;
}

@Table({ tableName: 'service-employer' })
export class Service_Employer extends Model<
  Service_Employer,
  Service_employerAttrs
> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Service Id',
  })
  @ForeignKey(() => Service)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
  })
  serviceId: number;

  @ApiProperty({
    example: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    description: 'Employer Id',
  })
  @ForeignKey(() => Employer)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
  })
  employerId: number;

  @ApiProperty({ example: 100_000, description: 'fee for work done' })
  @Column({

    type: DataType.INTEGER,
  })
  total_amount: number;

  @BelongsToMany(() => Customer,()=>Order)
  customer:Customer[]
  
  @BelongsTo(() => Service)
  service:Service[]
  
//   @BelongsTo(() => Customer)
//   customers:Customer[]
  
}
