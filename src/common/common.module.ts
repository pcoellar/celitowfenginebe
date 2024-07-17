import { Module } from '@nestjs/common';
import { IApiService } from './business-logic-layer/services/api/interfaces/api.interface';
import { ApiService } from './business-logic-layer/services/api/api.service';
import { ILoggerService } from './business-logic-layer/services/logger/interfaces/logger.interface';
import { LoggerService } from './business-logic-layer/services/logger/logger.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IQueueService } from './business-logic-layer/services/queue/interfaces/queue.interface';
import { QueueService } from './business-logic-layer/services/queue/queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WF_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://friealvy:8B03SnCyq_330MdGaLR5jkBkZY6iEtym@fly.rmq.cloudamqp.com/friealvy',
          ],
          queue: 'wf_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: IApiService,
      useClass: ApiService,
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
    {
      provide: IQueueService,
      useClass: QueueService,
    },
  ],
})
export class CommonModule {}
