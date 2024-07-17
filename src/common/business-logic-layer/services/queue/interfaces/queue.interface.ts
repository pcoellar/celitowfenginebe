export abstract class IQueueService {
  abstract sendData(pattern: any, data: any): void;
}
