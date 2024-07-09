import { EngineEventRequestDto } from 'src/wfengine/entities/dto-entities/engine-event-request.dto.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';

export abstract class IWfEventService {
  abstract execute(request: EngineEventRequestDto): Promise<EngineResponseDto>;
}
