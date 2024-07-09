import { ProcessInstanceActivityEntity } from '../../data-entities/process-instance-activity.data.entity';
import { ProcessInstanceEntity } from '../../data-entities/process-instance.data.entity';
import {
  EngineInstanceActivityResponseDto,
  EngineInstanceResponseDto,
} from '../engine-response.dto.entity';

export class EngineResponseParser {
  ParseToEngineInstanceResponseDto(
    processInstance: ProcessInstanceEntity,
  ): EngineInstanceResponseDto {
    const result: EngineInstanceResponseDto = {
      id: processInstance.id,
      number: processInstance.number,
      processVersionId: processInstance.processVersionId,
      start: processInstance.start,
      end: processInstance.end,
      status: processInstance.status,
      createdDate: processInstance.createdDate,
      lastModified: processInstance.lastModified,
      processInstanceActivities: [],
    };

    return result;
  }
  ParseToEngineInstanceActivityResponseDto(
    processInstanceActivity: ProcessInstanceActivityEntity,
  ): EngineInstanceActivityResponseDto {
    const result: EngineInstanceActivityResponseDto = {
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
