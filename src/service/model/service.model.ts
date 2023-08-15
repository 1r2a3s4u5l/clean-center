import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Table, Model, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Employer } from '../../employer/model/employer.model';
import { Service_Employer } from '../../service_employer/model/service_employer.model';

interface ServiceAttrs {
  name: string;
}

@Table({ tableName: 'service' })
export class Service extends Model<Service, ServiceAttrs> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Moshina, Uy, ofice', description: 'Xizmat nomi' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @BelongsToMany(() => Employer,()=>Service_Employer)
  employer:Employer[]
}
