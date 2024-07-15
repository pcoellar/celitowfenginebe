import { Column, Entity, OneToMany } from 'typeorm';
import { AuditableDataEntity } from 'src/common/entities/data-entities/base/auditable-data-entity';
import { Status } from '../enums/status.enum';
import { ProcessInstanceActivityEntity } from './process-instance-activity.data.entity';
import { ExecutionQueueEntity } from './execution-queue.data.entity';

@Entity('process_instance')
export class ProcessInstanceEntity extends AuditableDataEntity {
  @Column('varchar', { length: 20, nullable: false, unique: true })
  number: string;
  @Column('varchar', { length: 36, nullable: false })
  processVersionId: string;
  @Column('timestamp', { nullable: false })
  start: Date;
  @Column('timestamp', { nullable: true })
  end: Date;
  @Column('varchar', { length: 20, nullable: false })
  status: Status;
  @Column('json', { nullable: true })
  data: any;
  @OneToMany(
    () => ProcessInstanceActivityEntity,
    (processInstanceActivity) => processInstanceActivity.processInstance,
  )
  processInstanceActivities: ProcessInstanceActivityEntity[];
  @OneToMany(
    () => ExecutionQueueEntity,
    (executionQueue) => executionQueue.processInstance,
  )
  processInstanceExecutionQueue: ExecutionQueueEntity[];
}
