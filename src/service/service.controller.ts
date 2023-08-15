import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Service } from './model/service.model';
import {  ApiTags } from '@nestjs/swagger';
@ApiTags('service')

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @ApiOperation({ summary: 'add Service' })
  @Post('add')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @ApiOperation({ summary: 'get Service' })
  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @ApiOperation({ summary: 'getById Service' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @ApiOperation({ summary: 'update Service' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @ApiOperation({ summary: 'delete Service' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
