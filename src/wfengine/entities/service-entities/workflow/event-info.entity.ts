import { EventTypes } from '../../enums/event-types.enum';
import { EventInfoActivity } from './event-info-activity.entity';
import { EventInfoInstance } from './event-info-instance.entity';

export class EventInfo {
  eventName: EventTypes;
  timestamp: Date;
  detail: EventInfoInstance | EventInfoActivity;
}
