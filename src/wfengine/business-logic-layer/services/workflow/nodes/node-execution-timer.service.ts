import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { NodeDataTimer } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-timer.entity';
import { ConfigService } from '@nestjs/config';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';

@Injectable()
export class NodeExecutionTimer implements INodeExecution {
  constructor(
    private readonly configService: ConfigService,
    private readonly apiService: IApiService,
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
    const outInfo = new NodeExecutionOutInfo();
    console.log(
      'Node execution timer. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData),
      ' instanceId: ' + instanceId + ' nodeID: ' + nodeId,
    );

    //being trigger timer scheduler
    const timerData: NodeDataTimer = nodeData as NodeDataTimer;
    const targetDate = new Date();
    targetDate.setMinutes(targetDate.getMinutes() + timerData.minutes);
    const formatedDate: string = targetDate.toISOString();
    const schedulerInfo = {
      datetime: formatedDate,
      instance: instanceId,
      node: nodeId,
    };
    const wfWebHookSchedulerUrl: string = this.configService.get(
      'WFWEBHOOKSCHEDULER_URL',
    );
    await this.apiService.post(wfWebHookSchedulerUrl, schedulerInfo);
    //end trigger timer scheduler

    outInfo.result = NodeExecutionResult.Idle;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;
    return outInfo;
  }
}
