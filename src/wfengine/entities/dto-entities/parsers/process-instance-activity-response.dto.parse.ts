import { ProcessInstanceActivityEntity } from '../../data-entities/process-instance-activity.data.entity';
import { ProcessInstanceActivityResponseDto } from '../process-instance-activity-response.dto.entity';

export class ProcessInstanceActivityResponseParser {
  ParseToProcessInstanceActivityResponseDto(
    processInstanceActivity: ProcessInstanceActivityEntity,
  ): ProcessInstanceActivityResponseDto {
    const result: ProcessInstanceActivityResponseDto = {
      id: processInstanceActivity.id,
      nodeId: processInstanceActivity.nodeId,
      start: processInstanceActivity.start,
      end: processInstanceActivity.end,
      status: processInstanceActivity.status,
      createdDate: processInstanceActivity.createdDate,
      lastModified: processInstanceActivity.lastModified,
    };

    return result;
  }
}
