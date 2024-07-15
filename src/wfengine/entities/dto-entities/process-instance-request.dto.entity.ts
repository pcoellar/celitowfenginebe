import { Status } from '../enums/status.enum';

export class ProcessInstanceRequestDto {
  id: string;
  number: string;
  processVersionId: string;
  start: Date;
  end: Date;
  status: Status;
  data?: any;
}
