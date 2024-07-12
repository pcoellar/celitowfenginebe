import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { IDataRemoverService } from 'src/common/data-access-layer/repositories/interfaces/data-remover.interface';
import { IDataWriterService } from 'src/common/data-access-layer/repositories/interfaces/data-writer.interface';
import { ExecutionQueueEntity } from 'src/wfengine/entities/data-entities/execution-queue.data.entity';

export abstract class IExecutionQueueRepositoryService
  implements
    IDataReaderService<ExecutionQueueEntity>,
    IDataWriterService<ExecutionQueueEntity>,
    IDataRemoverService
{
  abstract findAll(relations?: string[]): Promise<ExecutionQueueEntity[]>;
  abstract find(
    id: string,
    relations?: string[],
  ): Promise<ExecutionQueueEntity>;
  abstract findByFilter(
    filter: any,
    relations?: string[],
  ): Promise<ExecutionQueueEntity[]>;
  abstract create(entity: ExecutionQueueEntity): Promise<ExecutionQueueEntity>;
  abstract update(
    entity: Partial<ExecutionQueueEntity>,
  ): Promise<ExecutionQueueEntity>;
  abstract delete(id: string): void;
}
