import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class DataEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
