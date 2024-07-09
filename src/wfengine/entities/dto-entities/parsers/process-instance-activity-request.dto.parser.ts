import { ProcessInstanceActivityEntity } from '../../data-entities/process-instance-activity.data.entity';
import { ProcessInstanceActivityRequestDto } from '../process-instance-activity-request.dto.entity';

export class ProcessInstanceActivityRequestParser {
  ParseToProcessInstanceActivityEntity(
    processInstanceActivityRequest: ProcessInstanceActivityRequestDto,
  ): Partial<ProcessInstanceActivityEntity> {
    const processInstanceActivity: Partial<ProcessInstanceActivityEntity> = {
      id: processInstanceActivityRequest.id,
      nodeId: processInstanceActivityRequest.nodeId,
      start: processInstanceActivityRequest.start,
      end: processInstanceActivityRequest.end,
      status: processInstanceActivityRequest.status,
    };
    return processInstanceActivity;
  }
}
