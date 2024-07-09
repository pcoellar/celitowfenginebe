import { ProcessInstanceActivityResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-activity-response.dto.entity';

export abstract class IGetProcessInstanceActivityService {
  abstract execute(id: string): Promise<ProcessInstanceActivityResponseDto>;
}
