import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IEngineManagerService } from './interfaces/engine-manager.interface';
import { Status } from 'src/wfengine/entities/enums/status.enum';
import { INodeExecution } from './interfaces/node-execution.interface';
import {
  ProcessVersion,
  ProcessVersionNode,
  ProcessVersionSequenceFlow,
} from 'src/wfengine/entities/service-entities/workflow/process-version.entity';
import { IExecutionQueueRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/execution-queue-repository.interface';
import { ProcessInstanceEntity } from 'src/wfengine/entities/data-entities/process-instance.data.entity';
import { IApiService } from 'src/common/business-logic-layer/services/api/interfaces/api.interface';
import { ConfigService } from '@nestjs/config';
import { Process } from 'src/wfengine/entities/service-entities/workflow/process.entity';
import { IProcessInstanceRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { NodeExecutionResult } from 'src/wfengine/entities/enums/node-execution-result.enum';
import { ExecutionQueueEntity } from 'src/wfengine/entities/data-entities/execution-queue.data.entity';
import { IProcessInstanceActivityRepositoryService } from 'src/wfengine/data-access-layer/repositories/interfaces/process-instance-activity-repository.interface';
import { ProcessInstanceActivityEntity } from 'src/wfengine/entities/data-entities/process-instance-activity.data.entity';
import { EngineResponseDto } from 'src/wfengine/entities/dto-entities/engine-response.dto.entity';
import { EngineStartRequestDto } from 'src/wfengine/entities/dto-entities/engine-start-request.dto.entity';
import { EngineEventRequestDto } from 'src/wfengine/entities/dto-entities/engine-event-request.dto.entity';
import { EngineResponseParser } from 'src/wfengine/entities/dto-entities/parsers/engine-response.dto.parser';
import { EnginePauseRequestDto } from 'src/wfengine/entities/dto-entities/engine-pause-request.dto.entity';
import { EngineContinueRequestDto } from 'src/wfengine/entities/dto-entities/engine-continue-request.dto.entity';
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-out-info.entity';
import { ILoggerService } from 'src/common/business-logic-layer/services/logger/interfaces/logger.interface';
import { ICacheService } from 'src/wfengine/data-access-layer/cache/interfaces/cache-service.interface';

@Injectable()
export class EngineManagerService implements IEngineManagerService {
  constructor(
    @Inject('NODES_EXECUTORS')
    private readonly nodesExecutors: INodeExecution[],
    private readonly executionQueueRepositoryService: IExecutionQueueRepositoryService,
    private readonly processInstanceRepositoryService: IProcessInstanceRepositoryService,
    private readonly processInstanceActivityRepositoryService: IProcessInstanceActivityRepositoryService,
    private readonly apiService: IApiService,
    private readonly configService: ConfigService,
    private readonly loggerService: ILoggerService,
    private readonly cacheService: ICacheService,
  ) {}

  private designerBaseUrl: string = this.configService.get(
    'WFDESIGNER_BASE_URL',
  );

  getNode(nodeId: string, processVersion: ProcessVersion): ProcessVersionNode {
    const nodes: ProcessVersionNode[] = processVersion.nodes.filter(
      (x) => x.id === nodeId,
    );
    return nodes[0];
  }

  async evaluateCondition(
    condition: string,
    processData: any,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const vm = require('node:vm');

    const context = {
      processData,
    };
    vm.createContext(context);
    const result = await vm.runInContext(condition, context);
    return result;
  }

  async getNextNodes(
    nodeId: string,
    processVersion: ProcessVersion,
    processData: any,
  ): Promise<ProcessVersionNode[]> {
    const nodes: ProcessVersionNode[] = [];
    const sequenceFlows: ProcessVersionSequenceFlow[] =
      processVersion.sequenceFlows.filter((x) => x.initNode === nodeId);
    if (sequenceFlows && sequenceFlows.length > 0) {
      for (let i = 0; i < sequenceFlows.length; i++) {
        let conditionResult = true;
        const condition = sequenceFlows[i].condition;
        if (condition) {
          conditionResult = await this.evaluateCondition(
            condition,
            processData,
          );
        }
        if (conditionResult) {
          const node: ProcessVersionNode = this.getNode(
            sequenceFlows[i].endNode,
            processVersion,
          );
          nodes.push(node);
        }
      }
    }
    return nodes;
  }

  async start(request: EngineStartRequestDto): Promise<EngineResponseDto> {
    this.loggerService.log(
      'WF Engine Execution',
      'Workflow started. Request: ' + JSON.stringify(request),
    );
    const processInstanceActivities = [];

    const processJson: string = await this.cacheService.get(request.processId);
    console.log('processJson: ', processJson);
    let process: Process = null;
    if (processJson) {
      this.loggerService.log('WF Engine Execution', 'Process info from cache');
      process = JSON.parse(processJson);
    } else {
      this.loggerService.log('WF Engine Execution', 'Process info from API');
      process = await this.apiService.get(
        `${this.designerBaseUrl}processes/${request.processId}`,
      );
      this.cacheService.set(request.processId, JSON.stringify(process));
    }

    const processVersionId: string = process.currentVersion;
    const processVersionJson: string =
      await this.cacheService.get(processVersionId);
    let processVersion = null;
    if (processVersionJson) {
      this.loggerService.log(
        'WF Engine Execution',
        'Process Version info from cache',
      );
      processVersion = JSON.parse(processVersionJson);
    } else {
      this.loggerService.log(
        'WF Engine Execution',
        'Process Version info from API',
      );
      processVersion = await this.apiService.get(
        `${this.designerBaseUrl}processes_version/${processVersionId}`,
      );
      await this.cacheService.set(
        processVersionId,
        JSON.stringify(processVersion),
      );
    }

    const newProcessInstanceId: string = uuidv4();
    const processInstance = await this.processInstanceRepositoryService.create({
      id: newProcessInstanceId,
      number: request.number,
      processVersionId: processVersionId,
      start: new Date(),
      end: null,
      data: {},
      status: Status.Pending,
      processInstanceActivities: null,
      processInstanceExecutionQueue: null,
    });
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Instance created. Process instance: ' + JSON.stringify(processInstance),
    );
    await this.executionQueueRepositoryService.create({
      id: uuidv4(),
      nodeId: processVersion.startNode,
      processInstance: processInstance,
    });
    return await this.runEngine(
      processInstance,
      processInstanceActivities,
      processVersion,
      {},
    );
  }

  async onEvent(request: EngineEventRequestDto): Promise<EngineResponseDto> {
    this.loggerService.log(
      'WF Engine Execution',
      'WebHook called. Request: ' + JSON.stringify(request),
    );
    const processInstanceActivities = [];
    const processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    if (processInstance.status !== Status.Pending) {
      const errorMsg = `Can not run engine, processInstance is in status: ${processInstance.status}`;
      this.loggerService.log(
        'WF Engine Execution - ' + processInstance.id,
        errorMsg,
      );
      throw new BadRequestException(errorMsg);
    }
    const processVersionId = processInstance.processVersionId;
    const processVersion = await this.apiService.get(
      `${this.designerBaseUrl}processes_version/${processVersionId}`,
    );
    const processInstanceActivitiesFound =
      await this.processInstanceActivityRepositoryService.findByFilter({
        processInstance: { id: request.processInstanceId },
        nodeId: request.nodeId,
        status: Status.Pending,
      });
    if (
      !processInstanceActivitiesFound ||
      processInstanceActivitiesFound.length === 0
    ) {
      const errorMsg = `There is no pending activity with the given parameters`;
      this.loggerService.log(
        'WF Engine Execution - ' + processInstance.id,
        errorMsg,
      );
      throw new BadRequestException(errorMsg);
    }
    const processInstanceActivity = processInstanceActivitiesFound[0];
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Continuing activity: ' + JSON.stringify(processInstanceActivity),
    );
    processInstanceActivity.end = new Date();
    processInstanceActivity.status = Status.Completed;
    this.processInstanceActivityRepositoryService.update(
      processInstanceActivity,
    );
    processInstanceActivities.push(processInstanceActivity);

    const processData = processInstance.data;

    const nextNodes: ProcessVersionNode[] = await this.getNextNodes(
      request.nodeId,
      processVersion,
      processData,
    );
    for (let i = 0; i < nextNodes.length; i++) {
      const newNodeToExecute: ExecutionQueueEntity = {
        id: uuidv4(),
        nodeId: nextNodes[i].id,
        processInstance: processInstance,
      };
      await this.executionQueueRepositoryService.create(newNodeToExecute);
    }
    return await this.runEngine(
      processInstance,
      processInstanceActivities,
      processVersion,
      processData,
    );
  }

  async pause(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    const processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Workflow pause. Request: ' + JSON.stringify(request),
    );
    processInstance.status = Status.Paused;
    await this.processInstanceRepositoryService.update(processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance:
        engineResponseParser.ParseToEngineInstanceResponseDto(processInstance),
    };
  }

  async continue(
    request: EngineContinueRequestDto,
  ): Promise<EngineResponseDto> {
    const processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Workflow continue. Request: ' + JSON.stringify(request),
    );
    processInstance.status = Status.Pending;
    await this.processInstanceRepositoryService.update(processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance:
        engineResponseParser.ParseToEngineInstanceResponseDto(processInstance),
    };
  }

  async abort(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    const processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Workflow abort. Request: ' + JSON.stringify(request),
    );
    processInstance.status = Status.Aborted;
    await this.processInstanceRepositoryService.update(processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance:
        engineResponseParser.ParseToEngineInstanceResponseDto(processInstance),
    };
  }

  private async runEngine(
    processInstance: ProcessInstanceEntity,
    processInstanceActivities: ProcessInstanceActivityEntity[],
    processVersion: ProcessVersion,
    processData: any,
  ): Promise<EngineResponseDto> {
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Workflow engine running.',
    );
    const nodesToExecute =
      await this.executionQueueRepositoryService.findByFilter({
        processInstance: {
          id: processInstance.id,
        },
      });
    let processInstanceStatus = Status.Completed;
    while (nodesToExecute.length > 0) {
      const node: ProcessVersionNode = this.getNode(
        nodesToExecute[0].nodeId,
        processVersion,
      );
      this.loggerService.log(
        'WF Engine Execution - ' + processInstance.id,
        'Executing node: ' + JSON.stringify(node),
      );
      const processInstanceActivity: ProcessInstanceActivityEntity =
        await this.processInstanceActivityRepositoryService.create({
          id: uuidv4(),
          nodeId: nodesToExecute[0].nodeId,
          start: new Date(),
          status: Status.Pending,
          processInstance: processInstance,
          nodeData: node.data,
        });
      let executed = false;
      for (let i = 0; i < this.nodesExecutors.length; i++) {
        if (this.nodesExecutors[i].canExecute(node.type, node.subtype)) {
          const executionInfo: NodeExecutionOutInfo = await this.nodesExecutors[
            i
          ].execute(node.data, processData, processInstance.id, node.id);
          processData = executionInfo.processData;
          if (executionInfo.result === NodeExecutionResult.Error) {
            const errorMsg = `Error while runnint node: ${node.id} of type:${node.type} and subtype:${node.subtype}`;
            this.loggerService.log(
              'WF Engine Execution  - ' + processInstance.id,
              errorMsg,
            );

            throw new Error(errorMsg);
          }
          await this.executionQueueRepositoryService.delete(
            nodesToExecute[0].id,
          );
          this.loggerService.log(
            'WF Engine Execution - ' + processInstance.id,
            'Node executed successfully and deleted from queue',
          );
          nodesToExecute.splice(0, 1);
          if (executionInfo.result === NodeExecutionResult.Finished) {
            const nextNodes: ProcessVersionNode[] = await this.getNextNodes(
              node.id,
              processVersion,
              processData,
            );
            for (let i = 0; i < nextNodes.length; i++) {
              const newNodeToExecute: ExecutionQueueEntity = {
                id: uuidv4(),
                nodeId: nextNodes[i].id,
                processInstance: processInstance,
              };
              const nodeCreated =
                await this.executionQueueRepositoryService.create(
                  newNodeToExecute,
                );
              nodesToExecute.push(nodeCreated);
            }
            processInstanceActivity.end = new Date();
            processInstanceActivity.status = Status.Completed;
            this.loggerService.log(
              'WF Engine Execution - ' + processInstance.id,
              'Node execution completed',
            );
          } else if (executionInfo.result === NodeExecutionResult.Idle) {
            processInstanceStatus = Status.Pending;
            this.loggerService.log(
              'WF Engine Execution - ' + processInstance.id,
              'Node execution idle. Waiting for webhook trigger to continue',
            );
          }
          processInstance.data = processData;
          this.processInstanceRepositoryService.update(processInstance);
          this.processInstanceActivityRepositoryService.update(
            processInstanceActivity,
          );
          processInstanceActivities.push(processInstanceActivity);
          executed = true;
        }
      }
      if (!executed) {
        const errorMsg = `Can not run node of type:${node.type} and subtype:${node.subtype}`;
        this.loggerService.log(
          'WF Engine Execution - ' + processInstance.id,
          errorMsg,
        );
        throw new Error(errorMsg);
      }
    }
    if (processInstanceStatus === Status.Completed) {
      processInstance.end = new Date();
      processInstance.status = Status.Completed;
      this.processInstanceRepositoryService.update(processInstance);
      this.loggerService.log(
        'WF Engine Execution - ' + processInstance.id,
        'Process instance completed, reached end of process',
      );
    } else {
      this.loggerService.log(
        'WF Engine Execution - ' + processInstance.id,
        'Process instance idle',
      );
    }
    const engineResponseParser = new EngineResponseParser();
    const result: EngineResponseDto = {
      processInstance:
        engineResponseParser.ParseToEngineInstanceResponseDto(processInstance),
    };
    for (let i = 0; i < processInstanceActivities.length; i++) {
      result.processInstance.processInstanceActivities.push(
        engineResponseParser.ParseToEngineInstanceActivityResponseDto(
          processInstanceActivities[i],
        ),
      );
    }
    this.loggerService.log(
      'WF Engine Execution - ' + processInstance.id,
      'Workflow engine execution result: ' + JSON.stringify(result),
    );
    return result;
  }
}
