import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { IDataWriterService } from 'src/common/data-access-layer/repositories/interfaces/data-writer.interface';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';

export abstract class IProcessInstanceRepositoryService
  implements
    IDataReaderService<ProcessInstanceEntity>,
    IDataWriterService<ProcessInstanceEntity>
{
  abstract findAll(): Promise<ProcessInstanceEntity[]>;
  abstract find(id: string): Promise<ProcessInstanceEntity>;
  abstract findByFilter(filter: any): Promise<ProcessInstanceEntity[]>;
  abstract create(
    entity: ProcessInstanceEntity,
  ): Promise<ProcessInstanceEntity>;
  abstract update(
    entity: Partial<ProcessInstanceEntity>,
  ): Promise<ProcessInstanceEntity>;
}
