import { Injectable } from '@nestjs/common';
import { ILoggerService } from './interfaces/logger.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  log(subject: string, message: string) {
    console.log(
      '\nLogger Service - Date: ' +
        new Date().toLocaleString() +
        '\nSubject: ' +
        subject +
        '\nMessage: ' +
        message,
    );
  }
}
