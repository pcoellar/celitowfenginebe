import { Column, Entity } from 'typeorm';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('script')
export class ScriptEntity extends AuditableDataEntity {
  @ApiProperty()
  @Column('text', { nullable: false })
  code: string;
  @ApiProperty()
  @Column('json', { nullable: true })
  params: any;
}
