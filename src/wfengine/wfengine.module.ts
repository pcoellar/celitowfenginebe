import { Module } from '@nestjs/common';
import { ProcessInstanceEntity } from './entities/data-entities/process-instance.data.entity';
import { ProcessInstanceActivityEntity } from './entities/data-entities/process-instance-activity.data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionQueueEntity } from './entities/data-entities/execution-queue.data.entity';
import { CommonModule } from 'src/common/common.module';
import { ProcessInstanceController } from './presentation-layer/controllers/process-instance.controller';
import { ProcessInstanceActivityController } from './presentation-layer/controllers/process-instance-activity.controller';
import { GetAllProcessInstanceService } from './business-logic-layer/usecases/process-instance/get-all-process-intance.service';
import { IGetAllProcessInstanceService } from './business-logic-layer/usecases/interfaces/process-instance/get-all-process-instance.interface';
import { IGetProcessInstanceService } from './business-logic-layer/usecases/interfaces/process-instance/get-process-instance.interface';
import { GetProcessInstanceService } from './business-logic-layer/usecases/process-instance/get-process-instance.service';
import { GetAllProcessInstanceActivityService } from './business-logic-layer/usecases/process-instance-activity/get-all-process-intance-activity.service';
import { IGetAllProcessInstanceActivityService } from './business-logic-layer/usecases/interfaces/process-instance-activity/get-all-process-instance.interface';
import { GetProcessInstanceActivityService } from './business-logic-layer/usecases/process-instance-activity/get-process-instance-activity.service';
import { IGetProcessInstanceActivityService } from './business-logic-layer/usecases/interfaces/process-instance-activity/get-process-instance.interface';
import { IProcessInstanceRepositoryService } from './data-access-layer/repositories/interfaces/process-instance-repository.interface';
import { ProcessInstanceRepositoryService } from './data-access-layer/repositories/process-instance-repository.service';
import { ProcessInstanceActivityRepositoryService } from './data-access-layer/repositories/process-instance-activity-repository.service';
import { IProcessInstanceActivityRepositoryService } from './data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';
import { ApiService } from 'src/common/business-logic-layer/services/api/api.service';
import { IEngineManagerService } from './business-logic-layer/services/workflow/interfaces/engine-manager.interface';
import { EngineManagerService } from './business-logic-layer/services/workflow/engine-manager.service';
import { NodeExecutionAsignUser } from './business-logic-layer/services/workflow/nodes/node-execution-asign-user.service';
import { NodeExecutionEventUndefined } from './business-logic-layer/services/workflow/nodes/node-execution-event-undefined.service';
import { NodeExecutionScript } from './business-logic-layer/services/workflow/nodes/node-execution-script.service';
import { NodeExecutionSignalThrow } from './business-logic-layer/services/workflow/nodes/node-execution-signal-throw.service';
import { NodeExecutionSignalCatch } from './business-logic-layer/services/workflow/nodes/node-execution-signal-catch.service';
import { NodeExecutionTaskUndefined } from './business-logic-layer/services/workflow/nodes/node-execution-task-undefined.service';
import { NodeExecutionTimer } from './business-logic-layer/services/workflow/nodes/node-execution-timer.service';
import { IGetCountProcessInstanceVersionService } from './business-logic-layer/usecases/interfaces/process-instance/get-count-process-instance-version.interface';
import { GetCountProcessInstanceVersionService } from './business-logic-layer/usecases/process-instance/get-count-process-intance-version.service';
import { ConfigService } from '@nestjs/config';
import { IWfStartService } from './business-logic-layer/usecases/interfaces/engine/wf-start.interface';
import { WfStartService } from './business-logic-layer/usecases/engine/wf-start.service';
import { IWfEventService } from './business-logic-layer/usecases/interfaces/engine/wf-event.interface';
import { WfEventService } from './business-logic-layer/usecases/engine/wf-event.service';
import { IWfAbortService } from './business-logic-layer/usecases/interfaces/engine/wf-abort.interface';
import { WfAbortService } from './business-logic-layer/usecases/engine/wf-abort.service';
import { IWfPauseService } from './business-logic-layer/usecases/interfaces/engine/wf-pause.interface';
import { WfPauseService } from './business-logic-layer/usecases/engine/wf-pause.service';
import { IWfContinueService } from './business-logic-layer/usecases/interfaces/engine/wf-continue.interface';
import { WfContinueService } from './business-logic-layer/usecases/engine/wf-continue.service';
import { IExecutionQueueRepositoryService } from './data-access-layer/repositories/interfaces/execution-queue-repository.interface';
import { ExecutionQueueRepositoryService } from './data-access-layer/repositories/execution-queue-repository.service';
import { WFEngineController } from './presentation-layer/controllers/wfengine.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcessInstanceEntity,
      ProcessInstanceActivityEntity,
      ExecutionQueueEntity,
    ]),
    CommonModule,
  ],
  providers: [
    {
      provide: IProcessInstanceRepositoryService,
      useClass: ProcessInstanceRepositoryService,
    },
    {
      provide: IProcessInstanceActivityRepositoryService,
      useClass: ProcessInstanceActivityRepositoryService,
    },
    {
      provide: IGetProcessInstanceActivityService,
      useClass: GetProcessInstanceActivityService,
    },
    {
      provide: IGetAllProcessInstanceActivityService,
      useClass: GetAllProcessInstanceActivityService,
    },
    {
      provide: IGetProcessInstanceService,
      useClass: GetProcessInstanceService,
    },
    {
      provide: IGetProcessInstanceService,
      useClass: GetProcessInstanceService,
    },
    {
      provide: IGetAllProcessInstanceService,
      useClass: GetAllProcessInstanceService,
    },
    {
      provide: IGetCountProcessInstanceVersionService,
      useClass: GetCountProcessInstanceVersionService,
    },
    {
      provide: IApiService,
      useClass: ApiService,
    },
    {
      provide: IEngineManagerService,
      useClass: EngineManagerService,
    },
    {
      provide: IWfStartService,
      useClass: WfStartService,
    },
    {
      provide: IWfEventService,
      useClass: WfEventService,
    },
    {
      provide: IWfAbortService,
      useClass: WfAbortService,
    },
    {
      provide: IWfPauseService,
      useClass: WfPauseService,
    },
    {
      provide: IWfContinueService,
      useClass: WfContinueService,
    },
    {
      provide: IExecutionQueueRepositoryService,
      useClass: ExecutionQueueRepositoryService,
    },
    NodeExecutionAsignUser,
    NodeExecutionEventUndefined,
    NodeExecutionScript,
    NodeExecutionSignalThrow,
    NodeExecutionSignalCatch,
    NodeExecutionTaskUndefined,
    NodeExecutionTimer,
    {
      provide: 'NODES_EXECUTORS',
      useFactory: (
        nodeExecutionAsignUser: NodeExecutionAsignUser,
        nodeExecutionEventUndefined: NodeExecutionEventUndefined,
        nodeExecutionScript: NodeExecutionScript,
        NodeExecutionSignalThrow: NodeExecutionSignalThrow,
        NodeExecutionSignalCatch: NodeExecutionSignalCatch,
        nodeExecutionTaskUndefined: NodeExecutionTaskUndefined,
        nodeExecutionTimer: NodeExecutionTimer,
      ) => [
        nodeExecutionAsignUser,
        nodeExecutionEventUndefined,
        nodeExecutionScript,
        NodeExecutionSignalThrow,
        NodeExecutionSignalCatch,
        nodeExecutionTaskUndefined,
        nodeExecutionTimer,
      ],
      inject: [
        NodeExecutionAsignUser,
        NodeExecutionEventUndefined,
        NodeExecutionScript,
        NodeExecutionSignalThrow,
        NodeExecutionSignalCatch,
        NodeExecutionTaskUndefined,
        NodeExecutionTimer,
      ],
    },
    ConfigService,
  ],
  controllers: [
    ProcessInstanceController,
    ProcessInstanceActivityController,
    WFEngineController,
  ],
  exports: [],
})
export class WfengineModule {}
