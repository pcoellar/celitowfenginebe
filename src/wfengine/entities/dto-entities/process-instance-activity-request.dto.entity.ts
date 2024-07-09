import { Status } from '../enums/status.enum';

export class ProcessInstanceActivityRequestDto {
  id: string;
  nodeId: string;
  start: Date;
  end: Date;
  status: Status;
}
