import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { ILoggerService } from 'src/common/business-logic-layer/services/logger/interfaces/logger.interface';

@Injectable()
export class NodeExecutionAsignUser implements INodeExecution {
  constructor(private readonly loggerService: ILoggerService) {}
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Task && subtype === NodeSubTypes.User) {
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
      'Node execution task user. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData) +
        ' instanceId: ' +
        instanceId +
        ' nodeID: ' +
        nodeId,
    );

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
