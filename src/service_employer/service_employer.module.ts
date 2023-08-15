import { Module } from '@nestjs/common';
import { ServiceEmployerService } from './service_employer.service';
import { ServiceEmployerController } from './service_employer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service_Employer } from './model/service_employer.model';

@Module({
  imports:[SequelizeModule.forFeature([Service_Employer])],
  controllers: [ServiceEmployerController],
  providers: [ServiceEmployerService],
  exports: [ServiceEmployerService],
})
export class ServiceEmployerModule {}
