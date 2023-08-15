import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './model/service.model';

@Module({
  imports: [SequelizeModule.forFeature([Service])],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
