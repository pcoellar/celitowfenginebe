import { EngineAbortRequestDto } from 'src/wfengine/entities/dto-entities/engine-abort-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';

export abstract class IWfAbortService {
  abstract execute(prequest: EngineAbortRequestDto): Promise<EngineResponseDto>;
}
