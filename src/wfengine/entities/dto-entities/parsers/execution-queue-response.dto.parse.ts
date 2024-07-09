import { ExecutionQueueEntity } from '../../data-entities/execution-queue.data.entity';
import { ExecutionQueueResponseDto } from '../execution-queue-response.dto.entity';

export class ExecutionQueueResponseParser {
  ParseToExecutionQueueResponseDto(
    executionQueue: ExecutionQueueEntity,
  ): ExecutionQueueResponseDto {
    const result: ExecutionQueueResponseDto = {
      id: executionQueue.id,
      nodeId: executionQueue.nodeId,
      createdDate: executionQueue.createdDate,
      lastModified: executionQueue.lastModified,
    };

    return result;
  }
}
