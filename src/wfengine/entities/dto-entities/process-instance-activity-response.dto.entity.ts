import { Status } from '../enums/status.enum';

export class ProcessInstanceActivityResponseDto {
  id: string;
  nodeId: string;
  start: Date;
  end: Date;
  status: Status;
  nodeData?: any;
  createdDate?: Date;
  lastModified?: Date;
}
