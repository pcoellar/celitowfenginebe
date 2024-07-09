import { Injectable } from '@nestjs/common';
import { IEngineManagerService } from '../../services/workflow/interfaces/engine-manager.interface';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { IWfAbortService } from '../interfaces/engine/wf-abort.interface';
import { EngineAbortRequestDto } from 'src/wfengine/entities/dto-entities/engine-abort-request.dto.entity';

@Injectable()
export class WfAbortService implements IWfAbortService {
  constructor(private readonly engineManagerService: IEngineManagerService) {}
  execute(request: EngineAbortRequestDto): Promise<EngineResponseDto> {
    return this.engineManagerService.abort(request);
  }
}
