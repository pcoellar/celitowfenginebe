import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-result.service.entity';

@Injectable()
export class NodeExecutionEventUndefined implements INodeExecution {
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Event && subtype === NodeSubTypes.Undefined) {
      return true;
    }
    return false;
  }

  execute(node_data: any, process_data: any): NodeExecutionOutInfo {
    const outInfo = new NodeExecutionOutInfo();
    console.log(
      'Node execution event undefined. node_data: ' +
        JSON.stringify(node_data) +
        ' process_data: ' +
        JSON.stringify(process_data),
    );
    outInfo.result = NodeExecutionResult.Finished;
    outInfo.process_data = process_data;
    return outInfo;
  }
}
