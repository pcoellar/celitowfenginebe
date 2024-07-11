import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-result.service.entity';

@Injectable()
export class NodeExecutionScript implements INodeExecution {
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Task && subtype === NodeSubTypes.Script) {
      return true;
    }
    return false;
  }

  execute(nodeData: any, processData: any): NodeExecutionOutInfo {
    const outInfo = new NodeExecutionOutInfo();
    console.log(
      'Node execution script. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData),
    );
    outInfo.result = NodeExecutionResult.Finished;
    outInfo.processData = processData;
    return outInfo;
  }
}
