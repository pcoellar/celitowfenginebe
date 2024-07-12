import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';

@Injectable()
export class NodeExecutionSignalCatch implements INodeExecution {
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Event && subtype === NodeSubTypes.SignalCatch) {
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
      'Node execution signal catch. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData),
      ' instanceId: ' + instanceId + ' nodeID: ' + nodeId,
    );
    outInfo.result = NodeExecutionResult.Idle;
    outInfo.processData = processData;
    outInfo.nodeData = nodeData;
    return outInfo;
  }
}
