import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';

export interface INodeExecution {
  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean;
  execute(
    nodeData: any,
    processData: any,
    instanceId: string,
    nodeId: string,
  ): Promise<NodeExecutionOutInfo>;
}
