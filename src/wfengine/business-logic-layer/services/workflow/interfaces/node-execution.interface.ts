import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-result.service.entity';

export interface INodeExecution {
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean;
  execute(node_data: any, process_data: any): NodeExecutionOutInfo;
}
