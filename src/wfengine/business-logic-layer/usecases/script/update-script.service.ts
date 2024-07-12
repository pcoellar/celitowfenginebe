import { Injectable } from '@nestjs/common';
import { IUpdateScriptService } from '../interfaces/script/update-script.interface';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';
import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';
import { ScriptRequestDto } from 'src/wfengine/entities/dto-entities/script-request.dto.entity';
import { ScriptRequestParser } from 'src/wfengine/entities/dto-entities/parsers/script-request.dto.parser';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { ScriptResponseParser } from 'src/wfengine/entities/dto-entities/parsers/script-response.dto.parse';

@Injectable()
export class UpdateScriptService implements IUpdateScriptService {
  constructor(
    private readonly scriptRespositoryService: IScriptRepositoryService,
  ) {}
  async execute(scriptRequest: ScriptRequestDto): Promise<ScriptResponseDto> {
    const scriptRequestParser = new ScriptRequestParser();
    const scriptEntity: Partial<ScriptEntity> =
      scriptRequestParser.ParseToScriptEntity(scriptRequest);
    const script: ScriptEntity =
      await this.scriptRespositoryService.update(scriptEntity);
    const scriptResponseParser = new ScriptResponseParser();
    const result: ScriptResponseDto =
      scriptResponseParser.ParseToScriptResponseDto(script);
    return result;
  }
}
