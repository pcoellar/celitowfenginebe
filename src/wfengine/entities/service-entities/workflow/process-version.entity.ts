import { NodeSubTypes } from '../../enums/node-subtypes.enum';
import { NodeTypes } from '../../enums/node-types.enum';

export class ProcessVersionNode {
  id: string;
  name: string;
  type: NodeTypes;
  subtype: NodeSubTypes;
  data: any;
  createdDate?: Date;
  lastModified?: Date;
}

export class ProcessVersionSequenceFlow {
  id: string;
  initNode: string;
  endNode: string;
  condition?: string;
  createdDate?: Date;
  lastModified?: Date;
}

export class ProcessVersion {
  id: string;
  version: number;
  startNode: string;
  nodes: ProcessVersionNode[];
  sequenceFlows: ProcessVersionSequenceFlow[];
  createdDate?: Date;
  lastModified?: Date;
}
