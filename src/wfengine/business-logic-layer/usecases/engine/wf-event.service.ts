import { Injectable } from '@nestjs/common';
import { IEngineManagerService } from '../../services/workflow/interfaces/engine-manager.interface';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineEventRequestDto } from 'src/wfengine/entities/dto-entities/engine-event-request.dto.entity';
import { IWfEventService } from '../interfaces/engine/wf-event.interface';

@Injectable()
export class WfEventService implements IWfEventService {
  constructor(private readonly engineManagerService: IEngineManagerService) {}
  execute(request: EngineEventRequestDto): Promise<EngineResponseDto> {
    return this.engineManagerService.onEvent(request);
  }
}
