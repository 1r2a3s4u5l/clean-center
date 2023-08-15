import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './model/service.model';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service) private readonly serviceRepo: typeof Service,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    return this.serviceRepo.create(createServiceDto);
  }

  findAll() {
    return this.serviceRepo.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });
    if (!service) {
      return new BadRequestException('id is not defined');
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepo.update(updateServiceDto, {
      where: { id },
      returning: true,
    });
    if (!service) {
      return new BadRequestException('id is not defined');
    }
    return service;
  }

  async remove(id: number) {
    const service = await this.serviceRepo.destroy({ where: { id } });
    if (!service) {
      return new BadRequestException('id is not defined');
    }
    return service;
  }
}
