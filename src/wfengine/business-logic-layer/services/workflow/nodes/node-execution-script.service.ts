import { Injectable } from '@nestjs/common';
import { INodeExecution } from '../interfaces/node-execution.interface';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { NodeSubTypes } from 'src/wfengine/entities/enums/node-subtypes.enum';
import { NodeTypes } from 'src/wfengine/entities/enums/node-types.enum';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { NodeDataScript } from 'src/wfengine/entities/service-entities/workflow/node-data/node-data-script.entity';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { IScriptRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/script-repository.interface';
import { ILoggerService } from 'src/common/business-logic-layer/services/logger/interfaces/logger.interface';

@Injectable()
export class NodeExecutionScript implements INodeExecution {
  constructor(
    private readonly scriptRepositoryService: IScriptRepositoryService,
    private readonly loggerService: ILoggerService,
  ) {}

  canExecute(type: NodeTypes, subtype: NodeSubTypes): boolean {
    if (type === NodeTypes.Task && subtype === NodeSubTypes.Script) {
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
      'Node execution execution script. nodeData: ' +
        JSON.stringify(nodeData) +
        ' processData: ' +
        JSON.stringify(processData) +
        ' instanceId: ' +
        instanceId +
        ' nodeID: ' +
        nodeId,
    );

    //begin dynamic code execution
    const scriptData: NodeDataScript = nodeData as NodeDataScript;
    const scriptEntity: ScriptEntity = await this.scriptRepositoryService.find(
      scriptData.scriptId,
    );
    const executeCode = new Function(scriptEntity.code);
    executeCode();
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Script executed successfully',
    );
    //end dynamic code execution

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
