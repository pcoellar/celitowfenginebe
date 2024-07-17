import { EventInfo } from 'src/wfengine/entities/service-entities/workflow/event-info.entity';

export abstract class IEngineQueueService {
  abstract SendToQueue(eventInfo: EventInfo): void;
}
