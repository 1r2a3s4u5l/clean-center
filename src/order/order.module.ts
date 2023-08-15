import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './model/order.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../customer/model/customer.model';
import { Service_Employer } from '../service_employer/model/service_employer.model';

@Module({
  imports: [SequelizeModule.forFeature([Order,Customer,Service_Employer])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
