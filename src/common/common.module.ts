import { Module } from '@nestjs/common';
import { IApiService } from './business-logic-layer/services/api/interfaces/api.interface';
import { ApiService } from './business-logic-layer/services/api/api.service';
import { ILoggerService } from './business-logic-layer/services/logger/interfaces/logger.interface';
import { LoggerService } from './business-logic-layer/services/logger/logger.service';

@Module({
  providers: [
    {
      provide: IApiService,
      useClass: ApiService,
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
  ],
})
export class CommonModule {}
