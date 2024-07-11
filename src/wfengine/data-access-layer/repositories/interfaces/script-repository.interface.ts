import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';

export abstract class IScriptRepositoryService
  implements IDataReaderService<ScriptEntity>
{
  abstract findAll(): Promise<ScriptEntity[]>;
  abstract find(id: string): Promise<ScriptEntity>;
  abstract findByFilter(filter: any): Promise<ScriptEntity[]>;
}
