import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Customer]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
