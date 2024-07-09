import { Column, Entity, ManyToOne } from 'typeorm';
import { ProcessInstanceEntity } from './process-instance.data.entity';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';

@Entity('execution_queue')
export class ExecutionQueueEntity extends AuditableDataEntity {
  @ManyToOne(
    () => ProcessInstanceEntity,
    (processInstanceEntity) =>
      processInstanceEntity.processInstanceExecutionQueue,
  )
  processInstance: ProcessInstanceEntity;
  @Column('varchar', { length: 36, nullable: false })
  nodeId: string;
}
