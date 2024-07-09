import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { IDataRemoverService } from 'src/common/data-access-layer/repositories/interfaces/data-remover.interface';
import { IDataWriterService } from 'src/common/data-access-layer/repositories/interfaces/data-writer.interface';
import { PendingActionEntity } from 'src/wfengine/entities/data-entities/pending-action.data.entity';

export abstract class IPendingActionRepositoryService
  implements
    IDataReaderService<PendingActionEntity>,
    IDataWriterService<PendingActionEntity>,
    IDataRemoverService
{
  abstract findAll(): Promise<PendingActionEntity[]>;
  abstract find(id: string): Promise<PendingActionEntity>;
  abstract findByFilter(filter: any): Promise<PendingActionEntity[]>;
  abstract create(entity: PendingActionEntity): Promise<PendingActionEntity>;
  abstract update(
    entity: Partial<PendingActionEntity>,
  ): Promise<PendingActionEntity>;
  abstract delete(id: string): void;
}
