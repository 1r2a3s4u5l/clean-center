import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceEmployerService } from './service_employer.service';
import { CreateServiceEmployerDto } from './dto/create-service_employer.dto';
import { UpdateServiceEmployerDto } from './dto/update-service_employer.dto';
import { Service_Employer } from './model/service_employer.model';
import { ApiOperation } from '@nestjs/swagger';
import {  ApiTags } from '@nestjs/swagger';
@ApiTags('service_employer')

@Controller('service-employer')
export class ServiceEmployerController {
  constructor(
    private readonly serviceEmployerService: ServiceEmployerService,
  ) {}

  @ApiOperation({ summary: 'add ServiceEmployer' })
  @Post('add')
  create(
    @Body() createServiceEmployerDto: CreateServiceEmployerDto,
  ): Promise<Service_Employer> {
    return this.serviceEmployerService.create(createServiceEmployerDto);
  }
  @ApiOperation({ summary: 'get ServiceEmployer' })
  @Get()
  findAll() {
    return this.serviceEmployerService.findAll();
  }

  @ApiOperation({ summary: 'getById ServiceEmployer' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceEmployerService.findOne(+id);
  }

  @ApiOperation({ summary: 'update ServiceEmployer' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    updateServiceEmployerDto: UpdateServiceEmployerDto,
  ) {
    return this.serviceEmployerService.update(+id, updateServiceEmployerDto);
  }

  @ApiOperation({ summary: 'delete ServiceEmployer' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceEmployerService.remove(+id);
  }
}
