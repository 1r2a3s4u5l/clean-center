import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/model/admin.model';
import { ConfigModule } from '@nestjs/config';
import { ServiceModule } from './service/service.module';
import { EmployerModule } from './employer/employer.module';
import { ServiceEmployerModule } from './service_employer/service_employer.module';
import { Service } from './service/model/service.model';
import { Employer } from './employer/model/employer.model';
import { Service_Employer } from './service_employer/model/service_employer.model';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/model/customer.model';
import { OrderModule } from './order/order.module';
import { Order } from './order/model/order.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [Admin, Service, Employer, Service_Employer, Customer, Order],
      autoLoadModels: true,
      logging: false,
    }),
    AdminModule,
    ServiceModule,
    EmployerModule,
    ServiceEmployerModule,
    CustomerModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
