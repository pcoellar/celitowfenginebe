import { PendingActionEntity } from '../../data-entities/pending-action.data.entity';
import { PendingActionRequestDto } from '../pending-action-request.dto.entity';

export class PendingActionRequestParser {
  ParseToPendingActionEntity(
    pendingActionRequest: PendingActionRequestDto,
  ): Partial<PendingActionEntity> {
    const pendingAction: Partial<PendingActionEntity> = {
      id: pendingActionRequest.id,
      data: pendingActionRequest.data,
    };
    return pendingAction;
  }
}
