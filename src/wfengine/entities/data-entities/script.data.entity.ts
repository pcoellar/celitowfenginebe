import { Column, Entity } from 'typeorm';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';

@Entity('script')
export class ScriptEntity extends AuditableDataEntity {
  @Column('text', { nullable: false })
  code: string;
  @Column('json', { nullable: true })
  params: any;
}
