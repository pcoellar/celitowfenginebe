import { Column, Entity, OneToOne } from 'typeorm';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';
import { ProcessInstanceActivityEntity } from './process-instance-activity.data.entity';

@Entity('pending_action')
export class PendingActionEntity extends AuditableDataEntity {
  @OneToOne(
    () => ProcessInstanceActivityEntity,
    (processInstanceActivityEntity) =>
      processInstanceActivityEntity.pendingAction,
  )
  processInstanceActivity: ProcessInstanceActivityEntity;
  @Column('json', { nullable: true })
  data: any;
}
