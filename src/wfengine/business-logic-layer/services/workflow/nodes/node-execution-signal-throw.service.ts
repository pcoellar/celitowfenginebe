import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { NodeDataSignal } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-signal.entity';
import { Status } from 'src/wfengine/entities/enums/status.enum';
import { IEngineManagerService } from '../interfaces/engine-manager.interface';

@Injectable()
export class NodeExecutionSignalThrow implements INodeExecution {
  constructor(
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
    private readonly engineManagerService: IEngineManagerService,
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
    for (let i = 0; i < catchSignalActivities.length; i++) {
      try {
        await this.engineManagerService.onEvent({
          processInstanceId: catchSignalActivities[i].processInstance.id,
          nodeId: catchSignalActivities[i].nodeId,
        });
      } catch {}
    }
    //end continue catch signal nodes

    outInfo.result = NodeExecutionResult.Finished;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;
    return outInfo;
  }
}
