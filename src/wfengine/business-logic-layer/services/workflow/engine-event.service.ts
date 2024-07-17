import { Injectable } from '@nestjs/common';
import { IEngineEventService } from './interfaces/engine-event.interface';
import { EventTypes } from 'src/wfengine/entities/enums/event-types.enum';
import { EventInfoActivity } from 'src/wfengine/entities/service-entities/workflow/event-info-activity.entity';
import { EventInfoInstance } from 'src/wfengine/entities/service-entities/workflow/event-info-instance.entity';
import { IEngineQueueService } from './interfaces/engine-queue.interface';

@Injectable()
export class EngineEventService implements IEngineEventService {
  constructor(private readonly engineQueueService: IEngineQueueService) {}

  publish(
    eventName: EventTypes,
    data: EventInfoInstance | EventInfoActivity,
  ): void {
    this.engineQueueService.SendToQueue({
      eventName: eventName,
      timestamp: new Date(),
      detail: data,
    });
  }
}
