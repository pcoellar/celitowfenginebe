import { Status } from '../enums/status.enum';
import { ProcessInstanceActivityResponseDto } from './process-instance-activity-response.dto.entity';

export class ProcessInstanceResponseDto {
  id: string;
  number: string;
  processVersionId: string;
  start: Date;
  end: Date;
  status: Status;
  createdDate?: Date;
  lastModified?: Date;
  processInstanceActivitiesResponse: ProcessInstanceActivityResponseDto[];
}
