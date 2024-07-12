import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { NodeDataSignalThrow } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-signal-throw.entity';
import { Status } from 'src/wfengine/entities/enums/status.enum';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';
import { ConfigService } from '@nestjs/config';
import { JsonContains } from 'typeorm';
import { ILoggerService } from 'src/common/business-logic-layer/services/logger/interfaces/logger.interface';

@Injectable()
export class NodeExecutionSignalThrow implements INodeExecution {
  constructor(
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
    private readonly apiService: IApiService,
    private readonly configService: ConfigService,
    private readonly loggerService: ILoggerService,
  ) {}

  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Event && subtype === NodeSubTypes.SignalThrow) {
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
      'Node execution signal throw. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData) +
        ' instanceId: ' +
        instanceId +
        ' nodeID: ' +
        nodeId,
    );

    //being continue catch signal nodes
    const signalData: NodeDataSignalThrow = nodeData as NodeDataSignalThrow;
    const catchSignalActivities =
      await this.processInstanceActivityRepositoryService.findByFilter(
        {
          status: Status.Pending,
          nodeData: JsonContains({
            catchSignal: signalData.throwSignal,
          }),
        },
        ['processInstance'],
      );

    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Pending activities with the triggered signal: ' +
        JSON.stringify(catchSignalActivities),
    );

    const wfWebHookUrl: string = this.configService.get('WFWEBHOOK_URL');
    for (let i = 0; i < catchSignalActivities.length; i++) {
      const body = {
        processInstanceId: catchSignalActivities[i].processInstance.id,
        nodeId: catchSignalActivities[i].nodeId,
      };
      this.loggerService.log(
        'WF Engine Execution - ' + instanceId,
        'Calling web hook with payload: ' + JSON.stringify(body),
      );
      await this.apiService.post(wfWebHookUrl, body);
    }
    //end continue catch signal nodes

    const outInfo = new NodeExecutionOutInfo();
    outInfo.result = NodeExecutionResult.Finished;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;

    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Node execution result: ' + JSON.stringify(outInfo),
    );

    return outInfo;
  }
}
