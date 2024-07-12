import { IDataReaderService } from 'src/common/data-access-layer/repositories/interfaces/data-reader.interface';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';

export abstract class IScriptRepositoryService
  implements IDataReaderService<ScriptEntity>
{
  abstract findAll(relations?: string[]): Promise<ScriptEntity[]>;
  abstract find(id: string, relations?: string[]): Promise<ScriptEntity>;
  abstract findByFilter(
    filter: any,
    relations?: string[],
  ): Promise<ScriptEntity[]>;
  abstract create(entity: ScriptEntity): Promise<ScriptEntity>;
  abstract update(entity: Partial<ScriptEntity>): Promise<ScriptEntity>;
  abstract delete(id: string);
}
