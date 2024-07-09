import { Module } from '@nestjs/common';
import { IApiService } from './business-logic-layer/services/api/interfaces/api.interface';
import { ApiService } from './business-logic-layer/services/api/api.service';

@Module({
  providers: [
    {
      provide: IApiService,
      useClass: ApiService,
    },
  ],
})
export class CommonModule {}
