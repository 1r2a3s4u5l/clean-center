import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employer } from './model/employer.model';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Employer]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
