import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Order } from './model/order.model';
import {  ApiTags } from '@nestjs/swagger';
@ApiTags('order')

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'add Order' })
  @Post('add')
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }
  @ApiOperation({ summary: 'get Order' })
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'getById Order' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @ApiOperation({ summary: 'update Order' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
  @ApiOperation({ summary: 'delete Order' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
