import { Injectable } from '@nestjs/common';
import { IEngineManagerService } from '../../services/workflow/interfaces/engine-manager.interface';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { IWfPauseService } from '../interfaces/engine/wf-pause.interface';
import { EnginePauseRequestDto } from 'src/wfengine/entities/dto-entities/engine-pause-request.dto.entity';

@Injectable()
export class WfPauseService implements IWfPauseService {
  constructor(private readonly engineManagerService: IEngineManagerService) {}
  execute(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    return this.engineManagerService.pause(request);
  }
}
