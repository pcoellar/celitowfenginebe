import { ProcessInstanceEntity } from '../../data-entities/process-instance.data.entity';
import { ProcessInstanceRequestDto } from '../process-instance-request.dto.entity';

export class ProcessInstanceRequestParser {
  ParseToProcessInstanceEntity(
    processInstanceRequest: ProcessInstanceRequestDto,
  ): Partial<ProcessInstanceEntity> {
    const processInstance: Partial<ProcessInstanceEntity> = {
      id: processInstanceRequest.id,
      number: processInstanceRequest.number,
      processVersionId: processInstanceRequest.processVersionId,
      start: processInstanceRequest.start,
      end: processInstanceRequest.end,
      status: processInstanceRequest.status,
    };
    return processInstance;
  }
}
