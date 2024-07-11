import { ScriptEntity } from '../../data-entities/script.data.entity';
import { ScriptResponseDto } from '../script-response.dto.entity';

export class ScriptResponseParser {
  ParseToScriptResponseDto(script: ScriptEntity): ScriptResponseDto {
    const result: ScriptResponseDto = {
      id: script.id,
      code: script.code,
      params: script.params,
      createdDate: script.createdDate,
      lastModified: script.lastModified,
    };

    return result;
  }
}
