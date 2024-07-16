import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { EventInfoInstance } from '../event-info-instance.entity';

export class EventInfoInstanceParser {
  ParseToEventInfoInstance(
    processInstance: ProcessInstanceEntity,
  ): EventInfoInstance {
    const result: EventInfoInstance = {
      idInstance: processInstance.id,
      number: processInstance.number,
      start: processInstance.start,
      end: processInstance.end,
      status: processInstance.status,
      data: processInstance.data,
    };

    return result;
  }
}
