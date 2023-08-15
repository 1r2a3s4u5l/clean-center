import { PartialType } from '@nestjs/swagger';
import { CreateServiceEmployerDto } from './create-service_employer.dto';

export class UpdateServiceEmployerDto extends PartialType(CreateServiceEmployerDto) {}
