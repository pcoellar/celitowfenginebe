import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineStartRequestDto } from 'src/wfengine/entities/dto-entities/engine-start-request.dto.entity';

export abstract class IWfStartService {
  abstract execute(request: EngineStartRequestDto): Promise<EngineResponseDto>;
}
