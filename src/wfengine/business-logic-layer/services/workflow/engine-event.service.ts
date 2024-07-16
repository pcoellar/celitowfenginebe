import { Injectable } from '@nestjs/common';
import { IEngineEventService } from './interfaces/engine-event.interface';
import { EventTypes } from 'src/wfengine/entities/enums/event-types.enum';
import { EventInfoActivity } from 'src/wfengine/entities/service-entities/workflow/event-info-activity.entity';
import { EventInfoInstance } from 'src/wfengine/entities/service-entities/workflow/event-info-instance.entity';
import { EventSubscriber } from 'src/wfengine/entities/service-entities/workflow/event-subscriber.entity';

@Injectable()
export class EngineEventService implements IEngineEventService {
  constructor() {}
  subscribers: EventSubscriber[];

  Subscribe(eventSubscribers: EventSubscriber[]): void {
    this.subscribers = [...this.subscribers, ...eventSubscribers];
  }

  Unsubscribe(eventUnsubscribers: EventSubscriber[]): void {
    this.subscribers = this.subscribers.filter((subscriber) => {
      eventUnsubscribers.forEach((unSubscriber) => {
        if (
          unSubscriber.eventName === subscriber.eventName &&
          unSubscriber.callback === subscriber.callback
        )
          return false;
      });
      return true;
    });
  }

  Publish(
    eventName: EventTypes,
    data: EventInfoInstance | EventInfoActivity,
  ): void {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.eventName === eventName) {
        subscriber.callback({
          eventName: eventName,
          timestamp: new Date(),
          detail: data,
        });
      }
    });
  }
}
