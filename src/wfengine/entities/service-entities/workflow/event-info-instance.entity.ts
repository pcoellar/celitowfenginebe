import { Status } from '../../enums/status.enum';

export class EventInfoInstance {
  idInstance: string;
  number: string;
  start: Date;
  end?: Date;
  status: Status;
  data?: any;
}
