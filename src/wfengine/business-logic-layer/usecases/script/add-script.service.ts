import { Injectable } from '@nestjs/common';
import { IAddScriptService } from '../interfaces/script/add-script.interface';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';
import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';
import { ScriptRequestDto } from 'src/wfengine/entities/dto-entities/script-request.dto.entity';
import { ScriptRequestParser } from 'src/wfengine/entities/dto-entities/parsers/script-request.dto.parser';
import { ScriptResponseParser } from 'src/wfengine/entities/dto-entities/parsers/script-response.dto.parse';

@Injectable()
export class AddScriptService implements IAddScriptService {
  constructor(
    private readonly scriptRepositoryService: IScriptRepositoryService,
  ) {}
  async execute(scriptRequest: ScriptRequestDto): Promise<ScriptResponseDto> {
    const scriptRequestParser = new ScriptRequestParser();
    let scriptEntity = scriptRequestParser.ParseToScriptEntity(scriptRequest);
    scriptEntity = await this.scriptRepositoryService.create(scriptEntity);

    const scriptResponseParser = new ScriptResponseParser();
    const response: ScriptResponseDto =
      scriptResponseParser.ParseToScriptResponseDto(scriptEntity);
    return response;
  }
}
