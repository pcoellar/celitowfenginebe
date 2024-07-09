import { EnginePauseRequestDto } from 'src/wfengine/entities/dto-entities/engine-pause-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';

export abstract class IWfPauseService {
  abstract execute(request: EnginePauseRequestDto): Promise<EngineResponseDto>;
}
