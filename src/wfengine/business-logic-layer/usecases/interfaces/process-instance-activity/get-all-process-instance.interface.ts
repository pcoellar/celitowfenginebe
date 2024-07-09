import { ProcessInstanceActivityResponseDto } from 'src/wfengine/entities/dto-entities/process-instance-activity-response.dto.entity';

export abstract class IGetAllProcessInstanceActivityService {
  abstract execute(): Promise<ProcessInstanceActivityResponseDto[]>;
}
