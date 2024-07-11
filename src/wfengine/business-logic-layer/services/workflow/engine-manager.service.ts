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
import { NodeExecutionOutInfo } from 'src/wfengine/entities/service-entities/workflow/node-execution-result.service.entity';
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
  ) {}

  private processInstance: ProcessInstanceEntity;
  private processInstanceActivities: ProcessInstanceActivityEntity[];
  private processVersion: ProcessVersion;
  private designerBaseUrl: string = this.configService.get(
    'WFDESIGNER_BASE_URL',
  );

  getNode(nodeId: string, processVersion: ProcessVersion): ProcessVersionNode {
    const nodes: ProcessVersionNode[] = processVersion.nodes.filter(
      (x) => x.id === nodeId,
    );
    return nodes[0];
  }

  getNextNodes(
    nodeId: string,
    processVersion: ProcessVersion,
  ): ProcessVersionNode[] {
    const nodes: ProcessVersionNode[] = [];
    const sequenceFlows: ProcessVersionSequenceFlow[] =
      processVersion.sequenceFlows.filter((x) => x.initNode === nodeId);
    if (sequenceFlows && sequenceFlows.length > 0) {
      for (let i = 0; i < sequenceFlows.length; i++) {
        const node: ProcessVersionNode = this.getNode(
          sequenceFlows[i].endNode,
          processVersion,
        );
        nodes.push(node);
      }
    }
    return nodes;
  }

  async start(request: EngineStartRequestDto): Promise<EngineResponseDto> {
    this.processInstanceActivities = [];
    const process: Process = await this.apiService.get(
      `${this.designerBaseUrl}processes/${request.processId}`,
    );
    const processVersionId: string = process.currentVersion;
    this.processVersion = await this.apiService.get(
      `${this.designerBaseUrl}processes_version/${processVersionId}`,
    );
    const newProcessInstanceId: string = uuidv4();
    this.processInstance = await this.processInstanceRepositoryService.create({
      id: newProcessInstanceId,
      number: request.number,
      processVersionId: processVersionId,
      start: new Date(),
      end: null,
      status: Status.Pending,
      processInstanceActivities: null,
      processInstanceExecutionQueue: null,
    });
    await this.executionQueueRepositoryService.create({
      id: uuidv4(),
      nodeId: this.processVersion.startNode,
      processInstance: this.processInstance,
    });
    return await this.runEngine();
  }

  async onEvent(request: EngineEventRequestDto): Promise<EngineResponseDto> {
    this.processInstanceActivities = [];
    this.processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    if (this.processInstance.status !== Status.Pending) {
      throw new BadRequestException(
        `Can not run engine, processInstance is in status: ${this.processInstance.status}`,
      );
    }
    const processVersionId = this.processInstance.processVersionId;
    this.processVersion = await this.apiService.get(
      `${this.designerBaseUrl}processes_version/${processVersionId}`,
    );
    const processInstanceActivities =
      await this.processInstanceActivityRepositoryService.findByFilter({
        processInstance: { id: request.processInstanceId },
        nodeId: request.nodeId,
        status: Status.Pending,
      });
    if (!processInstanceActivities || processInstanceActivities.length === 0) {
      throw new BadRequestException(
        `There is no pending activity with the given parameters`,
      );
    }
    const processInstanceActivity = processInstanceActivities[0];
    processInstanceActivity.end = new Date();
    processInstanceActivity.status = Status.Completed;
    this.processInstanceActivityRepositoryService.update(
      processInstanceActivity,
    );
    this.processInstanceActivities.push(processInstanceActivity);

    const nextNodes: ProcessVersionNode[] = this.getNextNodes(
      request.nodeId,
      this.processVersion,
    );
    for (let i = 0; i < nextNodes.length; i++) {
      const newNodeToExecute: ExecutionQueueEntity = {
        id: uuidv4(),
        nodeId: nextNodes[i].id,
        processInstance: this.processInstance,
      };
      await this.executionQueueRepositoryService.create(newNodeToExecute);
    }
    return await this.runEngine();
  }

  async pause(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    this.processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.processInstance.status = Status.Paused;
    await this.processInstanceRepositoryService.update(this.processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.processInstance,
      ),
    };
  }

  async continue(
    request: EngineContinueRequestDto,
  ): Promise<EngineResponseDto> {
    this.processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.processInstance.status = Status.Pending;
    await this.processInstanceRepositoryService.update(this.processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.processInstance,
      ),
    };
  }

  async abort(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    this.processInstance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.processInstance.status = Status.Aborted;
    await this.processInstanceRepositoryService.update(this.processInstance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.processInstance,
      ),
    };
  }

  private async runEngine(): Promise<EngineResponseDto> {
    const nodesToExecute =
      await this.executionQueueRepositoryService.findByFilter({
        processInstance: {
          id: this.processInstance.id,
        },
      });
    let processInstanceStatus = Status.Completed;
    while (nodesToExecute.length > 0) {
      const processInstanceActivity: ProcessInstanceActivityEntity =
        await this.processInstanceActivityRepositoryService.create({
          id: uuidv4(),
          nodeId: nodesToExecute[0].nodeId,
          start: new Date(),
          status: Status.Pending,
          processInstance: this.processInstance,
          pendingData: null,
        });
      const node: ProcessVersionNode = this.getNode(
        nodesToExecute[0].nodeId,
        this.processVersion,
      );
      let executed = false;
      for (let i = 0; i < this.nodesExecutors.length; i++) {
        if (this.nodesExecutors[i].canExecute(node.type, node.subtype)) {
          const executionInfo: NodeExecutionOutInfo = this.nodesExecutors[
            i
          ].execute(node.data, {});
          if (executionInfo.result === NodeExecutionResult.Error) {
            throw new Error(
              `Error while runnint node: ${node.id} of type:${node.type} and subtype:${node.subtype}`,
            );
          }
          await this.executionQueueRepositoryService.delete(
            nodesToExecute[0].id,
          );
          nodesToExecute.splice(0, 1);
          if (executionInfo.result === NodeExecutionResult.Finished) {
            const nextNodes: ProcessVersionNode[] = this.getNextNodes(
              node.id,
              this.processVersion,
            );
            for (let i = 0; i < nextNodes.length; i++) {
              const newNodeToExecute: ExecutionQueueEntity = {
                id: uuidv4(),
                nodeId: nextNodes[i].id,
                processInstance: this.processInstance,
              };
              const nodeCreated =
                await this.executionQueueRepositoryService.create(
                  newNodeToExecute,
                );
              nodesToExecute.push(nodeCreated);
            }
            processInstanceActivity.end = new Date();
            processInstanceActivity.status = Status.Completed;
          } else if (executionInfo.result === NodeExecutionResult.Idle) {
            processInstanceStatus = Status.Pending;
          }
          this.processInstanceActivityRepositoryService.update(
            processInstanceActivity,
          );
          this.processInstanceActivities.push(processInstanceActivity);
          executed = true;
        }
      }
      if (!executed) {
        throw new Error(
          `Can not run node of type:${node.type} and subtype:${node.subtype}`,
        );
      }
    }
    if (processInstanceStatus === Status.Completed) {
      this.processInstance.end = new Date();
      this.processInstance.status = Status.Completed;
      this.processInstanceRepositoryService.update(this.processInstance);
    }
    const engineResponseParser = new EngineResponseParser();
    const result: EngineResponseDto = {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.processInstance,
      ),
    };
    for (let i = 0; i < this.processInstanceActivities.length; i++) {
      result.processInstance.processInstanceActivities.push(
        engineResponseParser.ParseToEngineInstanceActivityResponseDto(
          this.processInstanceActivities[i],
        ),
      );
    }
    return result;
  }
}
