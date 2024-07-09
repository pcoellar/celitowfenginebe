import { Injectable } from '@nestjs/common';
import { IEngineManagerService } from '../../services/workflow/interfaces/engine-manager.interface';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { IWfContinueService } from '../interfaces/engine/wf-continue.interface';
import { EngineContinueRequestDto } from 'src/wfengine/entities/dto-entities/engine-continue-request.dto.entity';

@Injectable()
export class WfContinueService implements IWfContinueService {
  constructor(private readonly engineManagerService: IEngineManagerService) {}
  execute(request: EngineContinueRequestDto): Promise<EngineResponseDto> {
    return this.engineManagerService.continue(request);
  }
}
