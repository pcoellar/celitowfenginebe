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
import axios from 'axios';

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
    const params = scriptData.params;
    const scriptEntity: ScriptEntity = await this.scriptRepositoryService.find(
      scriptData.scriptId,
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const vm = require('node:vm');
    const context = {
      axios,
      console,
      processData,
    };
    vm.createContext(context);
    const paramsCode = params
      ? 'const params = JSON.parse(`' + JSON.stringify(params) + '`);\n '
      : '';
    const code = paramsCode + scriptEntity.code;
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Code to execute: ' + code,
    );
    const scriptResult = await vm.runInContext(code, context);
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Script executed successfully',
    );
    this.loggerService.log(
      'WF Engine Execution - ' + instanceId,
      'Script result: ' + JSON.stringify(scriptResult),
    );
    //end dynamic code execution

    if (scriptResult) {
      processData = { ...processData, ...scriptResult };
    }

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
