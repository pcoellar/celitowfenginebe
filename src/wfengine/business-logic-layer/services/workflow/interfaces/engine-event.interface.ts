import { EventTypes } from 'src/wfengine/entities/enums/event-types.enum';
import { EventInfoActivity } from 'src/wfengine/entities/service-entities/workflow/event-info-activity.entity';
import { EventInfoInstance } from 'src/wfengine/entities/service-entities/workflow/event-info-instance.entity';
import { EventSubscriber } from 'src/wfengine/entities/service-entities/workflow/event-subscriber.entity';

export abstract class IEngineEventService {
  abstract subscribers: EventSubscriber[];
  abstract Subscribe(eventSubscribers: EventSubscriber[]): void;
  abstract Unsubscribe(eventUnsubscribers: EventSubscriber[]): void;
  abstract Publish(
    eventName: EventTypes,
    data: EventInfoInstance | EventInfoActivity,
  ): void;
}
