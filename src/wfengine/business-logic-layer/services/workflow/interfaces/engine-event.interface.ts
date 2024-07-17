import { EventTypes } from 'src/wfengine/entities/enums/event-types.enum';
import { EventInfoActivity } from 'src/wfengine/entities/service-entities/workflow/event-info-activity.entity';
import { EventInfoInstance } from 'src/wfengine/entities/service-entities/workflow/event-info-instance.entity';

export abstract class IEngineEventService {
  abstract publish(
    eventName: EventTypes,
    data: EventInfoInstance | EventInfoActivity,
  ): void;
}
