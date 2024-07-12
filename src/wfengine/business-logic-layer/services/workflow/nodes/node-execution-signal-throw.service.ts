import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { NodeDataSignal } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-signal.entity';
import { Status } from 'src/wfengine/entities/enums/status.enum';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodeExecutionSignalThrow implements INodeExecution {
  constructor(
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
    private readonly apiService: IApiService,
    private readonly configService: ConfigService,
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
    const outInfo = new NodeExecutionOutInfo();
    console.log(
      'Node execution task user. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData),
      ' instanceId: ' + instanceId + ' nodeID: ' + nodeId,
    );

    //being continue catch signal nodes
    const signalData: NodeDataSignal = nodeData as NodeDataSignal;
    const catchSignalActivities =
      await this.processInstanceActivityRepositoryService.findByFilter({
        status: Status.Pending,
        nodeData: {
          signal: signalData.signal,
        },
      });
    const wfWebHookUrl: string = this.configService.get('WFWEBHOOK_URL');
    for (let i = 0; i < catchSignalActivities.length; i++) {
      try {
        const body = {
          processInstanceId: catchSignalActivities[i].processInstance.id,
          nodeId: catchSignalActivities[i].nodeId,
        };
        await this.apiService.post(wfWebHookUrl, body);
      } catch {}
    }
    //end continue catch signal nodes

    outInfo.result = NodeExecutionResult.Finished;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;
    return outInfo;
  }
}
