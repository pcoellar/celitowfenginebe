import { Injectable } from '@nestjs/common';
import { IQueueService } from 'src/common/business-logic-layer/services/queue/interfaces/queue.interface';
import { IEngineQueueService } from './interfaces/engine-queue.interface';
import { EventInfo } from 'src/wfengine/entities/service-entities/workflow/event-info.entity';

@Injectable()
export class EngineQueueService implements IEngineQueueService {
  constructor(private readonly queueService: IQueueService) {}
  SendToQueue(eventInfo: EventInfo) {
    this.queueService.sendData(eventInfo.eventName, {
      timestamp: eventInfo.timestamp,
      data: eventInfo.detail,
    });
  }
}
