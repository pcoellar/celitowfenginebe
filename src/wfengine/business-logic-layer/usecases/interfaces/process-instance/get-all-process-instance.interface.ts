import { ProcessInstanceResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-response.dto.entity';

export abstract class IGetAllProcessInstanceService {
  abstract execute(): Promise<ProcessInstanceResponseDto[]>;
}
