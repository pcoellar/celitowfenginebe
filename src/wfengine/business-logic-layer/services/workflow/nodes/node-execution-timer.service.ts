import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { NodeDataTimer } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-timer.entity';
import { ConfigService } from '@nestjs/config';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';
import { ILoggerService } from 'src/common/business-logic-layer/services/logger/interfaces/logger.interface';

@Injectable()
export class NodeExecutionTimer implements INodeExecution {
  constructor(
    private readonly configService: ConfigService,
    private readonly apiService: IApiService,
    private readonly loggerService: ILoggerService,
  ) {}

  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Event && subtype === NodeSubTypes.Timer) {
      return true;
    }
    return false;
  }

  async execute(
    nodeData: any,
    processData: any,
    instanceId: string,
    nodeId: string,
  ): Promise<NodeExecutionOutInfo> {
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Node execution timer. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData) +
        ' instanceId: ' +
        instanceId +
        ' nodeID: ' +
        nodeId,
    );

    //being trigger timer scheduler
    const timerData: NodeDataTimer = nodeData as NodeDataTimer;
    const targetDate = new Date();
    targetDate.setMinutes(targetDate.getMinutes() + timerData.minutes);
    const formatedDate: string = targetDate.toISOString().split('.')[0];
    const schedulerInfo = {
      datetime: formatedDate,
      instance: instanceId,
      node: nodeId,
    };
    const wfWebHookSchedulerUrl: string = this.configService.get(
      'WFWEBHOOKSCHEDULER_URL',
    );
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Webhook trigger schedule: ' + JSON.stringify(schedulerInfo),
    );
    const response = await this.apiService.post(
      wfWebHookSchedulerUrl,
      schedulerInfo,
    );
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Scheduler response: ' + JSON.stringify(response),
    );
    //end trigger timer scheduler

    const outInfo = new NodeExecutionOutInfo();
    outInfo.result = NodeExecutionResult.Idle;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;

    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Node execution result: ' + JSON.stringify(outInfo),
    );

    return outInfo;
  }
}
