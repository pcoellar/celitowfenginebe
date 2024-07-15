import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';

export abstract class IGetAllScriptService {
  abstract execute(): Promise<ScriptResponseDto[]>;
}
