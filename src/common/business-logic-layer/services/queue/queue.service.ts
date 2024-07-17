import { Inject, Injectable } from '@nestjs/common';
import { IQueueService } from './interfaces/queue.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class QueueService implements IQueueService {
  constructor(
    @Inject('WF_QUEUE_SERVICE')
    private readonly clientQueue: ClientProxy,
  ) {}

  sendData(pattern: any, data: any) {
    this.clientQueue.emit(pattern, data);
  }
}
