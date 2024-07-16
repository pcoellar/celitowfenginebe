import { EventInfoActivity } from '../event-info-activity.entity';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';

export class EventInfoActivityParser {
  ParseToEventInfoActivity(
    processInstanceActivity: ProcessInstanceActivityEntity,
  ): EventInfoActivity {
    const result: EventInfoActivity = {
      idActivity: processInstanceActivity.id,
      nodeId: processInstanceActivity.nodeId,
      start: processInstanceActivity.start,
      end: processInstanceActivity.end,
      status: processInstanceActivity.status,
    };

    return result;
  }
}
