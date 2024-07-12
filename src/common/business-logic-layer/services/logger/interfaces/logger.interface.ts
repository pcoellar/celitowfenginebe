export abstract class ILoggerService {
  abstract log(subject: string, message: string): void;
}
