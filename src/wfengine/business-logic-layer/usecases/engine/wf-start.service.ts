import { Injectable } from '@nestjs/common';
import { IEngineManagerService } from '../../services/workflow/interfaces/engine-manager.interface';
import { IWfStartService } from '../interfaces/engine/wf-start.interface';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineStartRequestDto } from 'src/wfengine/entities/dto-entities/engine-start-request.dto.entity';

@Injectable()
export class WfStartService implements IWfStartService {
  constructor(private readonly engineManagerService: IEngineManagerService) {}
  execute(request: EngineStartRequestDto): Promise<EngineResponseDto> {
    return this.engineManagerService.start(request);
  }
}
