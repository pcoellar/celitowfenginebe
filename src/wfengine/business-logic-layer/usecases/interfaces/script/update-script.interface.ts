import { ScriptRequestDto } from 'src/wfengine/entities/dto-entities/script-request.dto.entity';
import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';

export abstract class IUpdateScriptService {
  abstract execute(scriptRequest: ScriptRequestDto): Promise<ScriptResponseDto>;
}
