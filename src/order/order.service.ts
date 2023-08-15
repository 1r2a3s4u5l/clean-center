import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './model/order.model';

@Injectable()
export class OrderService {
    constructor(
      @InjectModel(Order) private readonly serviceRepo: typeof Order,
    ) {}
  
    create(createOrderDto: CreateOrderDto) {
      return this.serviceRepo.create(createOrderDto);
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
  
    async update(id: number, updateOrderDto: UpdateOrderDto) {
      const service = await this.serviceRepo.update(updateOrderDto, {
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
