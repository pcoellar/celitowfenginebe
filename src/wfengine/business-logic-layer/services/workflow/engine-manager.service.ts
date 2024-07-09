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

  private process_instance: ProcessInstanceEntity;
  private process_instance_activities: ProcessInstanceActivityEntity[];
  private process_version: ProcessVersion;
  private designerBaseUrl: string = this.configService.get(
    'WFDESIGNER_BASE_URL',
  );

  getNode(
    node_id: string,
    process_version: ProcessVersion,
  ): ProcessVersionNode {
    const nodes: ProcessVersionNode[] = process_version.nodes.filter(
      (x) => x.id === node_id,
    );
    return nodes[0];
  }

  getNextNodes(
    node_id: string,
    process_version: ProcessVersion,
  ): ProcessVersionNode[] {
    const nodes: ProcessVersionNode[] = [];
    const sequenceFlows: ProcessVersionSequenceFlow[] =
      process_version.sequenceFlows.filter((x) => x.initNode === node_id);
    if (sequenceFlows && sequenceFlows.length > 0) {
      for (let i = 0; i < sequenceFlows.length; i++) {
        const node: ProcessVersionNode = this.getNode(
          sequenceFlows[i].endNode,
          process_version,
        );
        nodes.push(node);
      }
    }
    return nodes;
  }

  async start(request: EngineStartRequestDto): Promise<EngineResponseDto> {
    this.process_instance_activities = [];
    const process: Process = await this.apiService.get(
      `${this.designerBaseUrl}processes/${request.processId}`,
    );
    const process_version_id: string = process.currentVersion;
    this.process_version = await this.apiService.get(
      `${this.designerBaseUrl}processes_version/${process_version_id}`,
    );
    const new_process_instance_id: string = uuidv4();
    this.process_instance = await this.processInstanceRepositoryService.create({
      id: new_process_instance_id,
      number: request.number,
      processVersionId: process_version_id,
      start: new Date(),
      end: null,
      status: Status.Pending,
      processInstanceActivities: null,
      processInstanceExecutionQueue: null,
    });
    await this.executionQueueRepositoryService.create({
      id: uuidv4(),
      nodeId: this.process_version.startNode,
      processInstance: this.process_instance,
    });
    return await this.run_engine();
  }

  async onEvent(request: EngineEventRequestDto): Promise<EngineResponseDto> {
    this.process_instance_activities = [];
    this.process_instance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    if (this.process_instance.status !== Status.Pending) {
      throw new BadRequestException(
        `Can not run engine, process_instance is in status: ${this.process_instance.status}`,
      );
    }
    const process_version_id = this.process_instance.processVersionId;
    this.process_version = await this.apiService.get(
      `${this.designerBaseUrl}processes_version/${process_version_id}`,
    );
    const process_instance_activities =
      await this.processInstanceActivityRepositoryService.findByFilter({
        processInstance: { id: request.processInstanceId },
        nodeId: request.nodeId,
        status: Status.Pending,
      });
    if (
      !process_instance_activities ||
      process_instance_activities.length === 0
    ) {
      throw new BadRequestException(
        `There is no pending activity with the given parameters`,
      );
    }
    const process_instance_activity = process_instance_activities[0];
    process_instance_activity.end = new Date();
    process_instance_activity.status = Status.Completed;
    this.processInstanceActivityRepositoryService.update(
      process_instance_activity,
    );
    this.process_instance_activities.push(process_instance_activity);

    const nextNodes: ProcessVersionNode[] = this.getNextNodes(
      request.nodeId,
      this.process_version,
    );
    for (let i = 0; i < nextNodes.length; i++) {
      const newNodeToExecute: ExecutionQueueEntity = {
        id: uuidv4(),
        nodeId: nextNodes[i].id,
        processInstance: this.process_instance,
      };
      await this.executionQueueRepositoryService.create(newNodeToExecute);
    }
    return await this.run_engine();
  }

  async pause(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    this.process_instance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.process_instance.status = Status.Paused;
    await this.processInstanceRepositoryService.update(this.process_instance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.process_instance,
      ),
    };
  }

  async continue(
    request: EngineContinueRequestDto,
  ): Promise<EngineResponseDto> {
    this.process_instance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.process_instance.status = Status.Pending;
    await this.processInstanceRepositoryService.update(this.process_instance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.process_instance,
      ),
    };
  }

  async abort(request: EnginePauseRequestDto): Promise<EngineResponseDto> {
    this.process_instance = await this.processInstanceRepositoryService.find(
      request.processInstanceId,
    );
    this.process_instance.status = Status.Aborted;
    await this.processInstanceRepositoryService.update(this.process_instance);
    const engineResponseParser = new EngineResponseParser();
    return {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.process_instance,
      ),
    };
  }

  private async run_engine(): Promise<EngineResponseDto> {
    const nodesToExecute =
      await this.executionQueueRepositoryService.findByFilter({
        processInstance: {
          id: this.process_instance.id,
        },
      });
    let process_instance_status = Status.Completed;
    while (nodesToExecute.length > 0) {
      const processInstanceActivity: ProcessInstanceActivityEntity =
        await this.processInstanceActivityRepositoryService.create({
          id: uuidv4(),
          nodeId: nodesToExecute[0].nodeId,
          start: new Date(),
          status: Status.Pending,
          processInstance: this.process_instance,
          pendingAction: null,
        });
      const node: ProcessVersionNode = this.getNode(
        nodesToExecute[0].nodeId,
        this.process_version,
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
              this.process_version,
            );
            for (let i = 0; i < nextNodes.length; i++) {
              const newNodeToExecute: ExecutionQueueEntity = {
                id: uuidv4(),
                nodeId: nextNodes[i].id,
                processInstance: this.process_instance,
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
            process_instance_status = Status.Pending;
          }
          this.processInstanceActivityRepositoryService.update(
            processInstanceActivity,
          );
          this.process_instance_activities.push(processInstanceActivity);
          executed = true;
        }
      }
      if (!executed) {
        throw new Error(
          `Can not run node of type:${node.type} and subtype:${node.subtype}`,
        );
      }
    }
    if (process_instance_status === Status.Completed) {
      this.process_instance.end = new Date();
      this.process_instance.status = Status.Completed;
      this.processInstanceRepositoryService.update(this.process_instance);
    }
    const engineResponseParser = new EngineResponseParser();
    const result: EngineResponseDto = {
      processInstance: engineResponseParser.ParseToEngineInstanceResponseDto(
        this.process_instance,
      ),
    };
    for (let i = 0; i < this.process_instance_activities.length; i++) {
      result.processInstance.processInstanceActivities.push(
        engineResponseParser.ParseToEngineInstanceActivityResponseDto(
          this.process_instance_activities[i],
        ),
      );
    }
    return result;
  }
}
