import { Injectable } from '@nestjs/common';
import { IScriptRepositoryService } from 'src/wfdefinition/data-acces-layer/repositories/interfaces/script-repository.interface';
import { ScriptEntity } from 'src/wfdefinition/entities/data-entities/script.data.entity';
import { ScriptRequestParser } from 'src/wfdefinition/entities/dto-entities/parsers/script-request.dto.parser';
import { ScriptResponseParser } from 'src/wfdefinition/entities/dto-entities/parsers/script-response.dto.parse';
import { ScriptResponseDto } from 'src/wfdefinition/entities/dto-entities/script-response.dto.entity';
import { ScriptRequestDto } from 'src/wfdefinition/entities/dto-entities/script-request.dto.entity';
import { IUpdateScriptService } from '../interfaces/script/update-script.interface';

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
