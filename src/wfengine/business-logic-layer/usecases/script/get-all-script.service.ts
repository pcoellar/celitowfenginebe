import { Injectable } from '@nestjs/common';
import { IGetAllScriptService } from '../interfaces/script/get-all-script.interface';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';
import { ScriptResponseDto } from 'src/wfengine/entities/dto-entities/script-response.dto.entity';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { ScriptResponseParser } from 'src/wfengine/entities/dto-entities/parsers/script-response.dto.parse';

@Injectable()
export class GetAllScriptService implements IGetAllScriptService {
  constructor(
    private readonly scriptRepositoryService: IScriptRepositoryService,
  ) {}
  async execute(): Promise<ScriptResponseDto[]> {
    const scriptEntities: ScriptEntity[] =
      await this.scriptRepositoryService.findAll();
    const result: ScriptResponseDto[] = [];
    for (let i = 0; i < scriptEntities.length; i++) {
      const getScriptResponseParser = new ScriptResponseParser();
      const scriptResponseDto =
        getScriptResponseParser.ParseToScriptResponseDto(scriptEntities[i]);
      result.push(scriptResponseDto);
    }
    return result;
  }
}
