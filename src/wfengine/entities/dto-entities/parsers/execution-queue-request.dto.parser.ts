import { ExecutionQueueEntity } from '../../data-entities/execution-queue.data.entity';
import { ExecutionQueueRequestDto } from '../execution-queue-request.dto.entity';

export class ExecutionQueueRequestParser {
  ParseToExecutionQueueEntity(
    executionQueueRequest: ExecutionQueueRequestDto,
  ): Partial<ExecutionQueueEntity> {
    const executionQueue: Partial<ExecutionQueueEntity> = {
      id: executionQueueRequest.id,
      nodeId: executionQueueRequest.nodeId,
    };
    return executionQueue;
  }
}
