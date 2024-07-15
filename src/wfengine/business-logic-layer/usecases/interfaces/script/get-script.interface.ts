import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';

export abstract class IGetScriptService {
  abstract execute(id: string): Promise<ScriptResponseDto>;
}
