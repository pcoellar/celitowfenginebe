import { Column } from 'typeorm';
import { DataEntity } from './data-entity.data';

export abstract class AuditableDataEntity extends DataEntity {
  @Column('timestamp', { nullable: true })
  createdDate?: Date;
  @Column('timestamp', { nullable: true })
  lastModified?: Date;
}
