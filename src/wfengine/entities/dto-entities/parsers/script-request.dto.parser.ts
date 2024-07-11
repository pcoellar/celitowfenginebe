import { ScriptEntity } from '../../data-entities/script.data.entity';
import { ScriptRequestDto } from '../script-request.dto.entity';

export class ScriptRequestParser {
  ParseToScriptEntity(scriptRequest: ScriptRequestDto): ScriptEntity {
    const script: ScriptEntity = {
      id: scriptRequest.id,
      code: scriptRequest.code,
      params: scriptRequest.params,
    };
    return script;
  }
}
