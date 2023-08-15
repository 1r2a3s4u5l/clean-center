import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceEmployerDto } from './dto/create-service_employer.dto';
import { UpdateServiceEmployerDto } from './dto/update-service_employer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Service_Employer } from './model/service_employer.model';

@Injectable()
export class ServiceEmployerService {
  constructor(
    @InjectModel(Service_Employer) private seRepo: typeof Service_Employer,
  ) {}

  create(createServiceEmployerDto: CreateServiceEmployerDto) {
    return this.seRepo.create(createServiceEmployerDto);
  }

  findAll() {
    return this.seRepo.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.seRepo.findOne({ include: { all: true } });
  }


  async update(id: number, updateServiceEmployerDto: UpdateServiceEmployerDto) {
    const service_employer = await this.seRepo.update(
      updateServiceEmployerDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (!service_employer) {
      return new BadRequestException('id is not defined');
    }
    return service_employer;
  }

  remove(id: number) {
    return this.seRepo.destroy({ where: { id } });
  }
}
