import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { IDataWriterService } from 'src/common/data-access-layer/repositories/interfaces/data-writer.interface';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';

export abstract class IProcessInstanceActivityRepositoryService
  implements
    IDataReaderService<ProcessInstanceActivityEntity>,
    IDataWriterService<ProcessInstanceActivityEntity>
{
  abstract findAll(): Promise<ProcessInstanceActivityEntity[]>;
  abstract find(id: string): Promise<ProcessInstanceActivityEntity>;
  abstract findByFilter(filter: any): Promise<ProcessInstanceActivityEntity[]>;
  abstract create(
    entity: ProcessInstanceActivityEntity,
  ): Promise<ProcessInstanceActivityEntity>;
  abstract update(
    entity: Partial<ProcessInstanceActivityEntity>,
  ): Promise<ProcessInstanceActivityEntity>;
}
