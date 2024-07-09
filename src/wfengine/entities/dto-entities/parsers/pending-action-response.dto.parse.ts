import { PendingActionEntity } from '../../data-entities/pending-action.data.entity';
import { PendingActionResponseDto } from '../pending-action-response.dto.entity';

export class PendingActionResponseParser {
  ParseToPendingActionResponseDto(
    pendingAction: PendingActionEntity,
  ): PendingActionResponseDto {
    const result: PendingActionResponseDto = {
      id: pendingAction.id,
      data: pendingAction.data,
      createdDate: pendingAction.createdDate,
      lastModified: pendingAction.lastModified,
    };

    return result;
  }
}
