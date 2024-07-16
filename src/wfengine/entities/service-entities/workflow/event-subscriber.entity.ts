import { EventTypes } from '../../enums/event-types.enum';
import { EventInfo } from './event-info.entity';

export class EventSubscriber {
  eventName: EventTypes;
  callback: (eventInfo: EventInfo) => void;
}
