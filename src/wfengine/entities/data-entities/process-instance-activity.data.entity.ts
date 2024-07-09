import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';
import { Status } from '../enums/status.enum';
import { ProcessInstanceEntity } from './process-instance.data.entity';
import { PendingActionEntity } from './pending-action.data.entity';

@Entity('process_instance_activity')
export class ProcessInstanceActivityEntity extends AuditableDataEntity {
  @ManyToOne(
    () => ProcessInstanceEntity,
    (processInstanceEntity) => processInstanceEntity.processInstanceActivities,
  )
  processInstance: ProcessInstanceEntity;
  @Column('varchar', { length: 36, nullable: false })
  nodeId: string;
  @Column('timestamp', { nullable: false })
  start: Date;
  @Column('timestamp', { nullable: true })
  end?: Date;
  @Column('varchar', { length: 20, nullable: false })
  status: Status;
  @OneToOne(
    () => PendingActionEntity,
    (pendingActionEntity) => pendingActionEntity.processInstanceActivity,
  )
  pendingAction: PendingActionEntity;
}
