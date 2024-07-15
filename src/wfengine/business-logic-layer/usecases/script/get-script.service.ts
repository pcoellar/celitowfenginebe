import { Injectable } from '@nestjs/common';
import { IGetScriptService } from '../interfaces/script/get-script.interface';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';
import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { ScriptResponseParser } from 'src/wfengine/entities/dto-entities/parsers/script-response.dto.parse';

@Injectable()
export class GetScriptService implements IGetScriptService {
  constructor(
    private readonly scriptRepositoryService: IScriptRepositoryService,
  ) {}
  async execute(id: string): Promise<ScriptResponseDto> {
    const script: ScriptEntity = await this.scriptRepositoryService.find(id);
    const getScriptResponseParser = new ScriptResponseParser();
    const result: ScriptResponseDto =
      getScriptResponseParser.ParseToScriptResponseDto(script);
    return result;
  }
}
