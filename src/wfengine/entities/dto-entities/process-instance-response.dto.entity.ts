import { Status } from '../enums/status.enum';

export class ProcessInstanceResponseDto {
  id: string;
  number: string;
  processVersionId: string;
  start: Date;
  end: Date;
  status: Status;
  createdDate?: Date;
  lastModified?: Date;
}
