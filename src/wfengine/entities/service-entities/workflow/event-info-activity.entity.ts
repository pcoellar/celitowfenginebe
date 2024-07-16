import { Status } from '../../enums/status.enum';

export class EventInfoActivity {
  idActivity: string;
  nodeId: string;
  start: Date;
  end?: Date;
  status: Status;
}
