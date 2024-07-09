import { EngineContinueRequestDto } from 'src/wfengine/entities/dto-entities/engine-continue-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';

export abstract class IWfContinueService {
  abstract execute(
    request: EngineContinueRequestDto,
  ): Promise<EngineResponseDto>;
}
