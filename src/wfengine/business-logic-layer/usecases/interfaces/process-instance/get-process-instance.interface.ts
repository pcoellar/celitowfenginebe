import { ProcessInstanceResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-response.dto.entity';

export abstract class IGetProcessInstanceService {
  abstract execute(id: string): Promise<ProcessInstanceResponseDto>;
}
