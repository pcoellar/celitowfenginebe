import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WfengineModule } from './wfengine/wfengine.module';
import { ProcessInstanceEntity } from './wfengine/entities/data-entities/process-instance.data.entity';
import { ProcessInstanceActivityEntity } from './wfengine/entities/data-entities/process-instance-activity.data.entity';
import { PendingActionEntity } from './wfengine/entities/data-entities/pending-action.data.entity';
import { ExecutionQueueEntity } from './wfengine/entities/data-entities/execution-queue.data.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl: true,
        entities: [
          ProcessInstanceEntity,
          ProcessInstanceActivityEntity,
          PendingActionEntity,
          ExecutionQueueEntity,
        ],
        synchronize: true,
      }),
    }),
    WfengineModule,
    CommonModule,
  ],
})
export class AppModule {}
