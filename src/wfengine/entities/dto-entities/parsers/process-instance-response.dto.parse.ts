import { ProcessInstanceEntity } from '../../data-entities/process-instance.data.entity';
import { ProcessInstanceResponseDto } from '../process-instance-response.dto.entity';

export class ProcessInstanceResponseParser {
  ParseToProcessInstanceResponseDto(
    processInstance: ProcessInstanceEntity,
  ): ProcessInstanceResponseDto {
    const result: ProcessInstanceResponseDto = {
      id: processInstance.id,
      number: processInstance.number,
      processVersionId: processInstance.processVersionId,
      start: processInstance.start,
      end: processInstance.end,
      status: processInstance.status,
      createdDate: processInstance.createdDate,
      lastModified: processInstance.lastModified,
    };

    return result;
  }
}
