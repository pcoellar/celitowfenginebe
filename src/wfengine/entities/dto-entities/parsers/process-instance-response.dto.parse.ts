import { ProcessInstanceEntity } from '../../data-entities/process-instance.data.entity';
import { ProcessInstanceResponseDto } from '../process-instance-response.dto.entity';
import { ProcessInstanceActivityResponseParser } from './process-instance-activity-response.dto.parse';

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
      data: processInstance.data,
      createdDate: processInstance.createdDate,
      lastModified: processInstance.lastModified,
      processInstanceActivities: [],
    };
    const processInstanceActivityResponseParser =
      new ProcessInstanceActivityResponseParser();
    for (let i = 0; i < processInstance.processInstanceActivities.length; i++) {
      const activity =
        processInstanceActivityResponseParser.ParseToProcessInstanceActivityResponseDto(
          processInstance.processInstanceActivities[i],
        );
      result.processInstanceActivities.push(activity);
    }

    return result;
  }
}
