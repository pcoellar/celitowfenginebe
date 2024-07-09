import { Status } from '../enums/status.enum';

export class EngineInstanceActivityResponseDto {
  id: string;
  nodeId: string;
  start: Date;
  end?: Date;
  status: Status;
  createdDate?: Date;
  lastModified?: Date;
}

export class EngineInstanceResponseDto {
  id: string;
  number: string;
  processVersionId: string;
  start: Date;
  end?: Date;
  status: Status;
  createdDate?: Date;
  lastModified?: Date;
  processInstanceActivities: EngineInstanceActivityResponseDto[];
}

export class EngineResponseDto {
  processInstance: EngineInstanceResponseDto;
}
