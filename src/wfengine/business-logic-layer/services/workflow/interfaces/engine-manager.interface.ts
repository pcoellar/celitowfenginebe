import { EngineAbortRequestDto } from 'src/wfengine/entities/dto-entities/engine-abort-request.dto.entity';
import { EngineContinueRequestDto } from 'src/wfengine/entities/dto-entities/engine-continue-request.dto.entity';
import { EngineEventRequestDto } from 'src/wfengine/entities/dto-entities/engine-event-request.dto.entity';
import { EnginePauseRequestDto } from 'src/wfengine/entities/dto-entities/engine-pause-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineStartRequestDto } from 'src/wfengine/entities/dto-entities/engine-start-request.dto.entity';

export abstract class IEngineManagerService {
  abstract start(request: EngineStartRequestDto): Promise<EngineResponseDto>;
  abstract onEvent(request: EngineEventRequestDto): Promise<EngineResponseDto>;
  abstract pause(request: EnginePauseRequestDto): Promise<EngineResponseDto>;
  abstract continue(
    request: EngineContinueRequestDto,
  ): Promise<EngineResponseDto>;
  abstract abort(request: EngineAbortRequestDto): Promise<EngineResponseDto>;
}
