// logging.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
import { CustomWritableStream } from './custom-writable-stream';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger;

  constructor() {
    const logFilePath = path.join(__dirname, '../../logs/application.log');

    const customWritableStream = new CustomWritableStream(logFilePath);

    const customFormat = format.printf(({ message, timestamp }) => {
      return `${timestamp} :: ${message}`;
    });

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'MM/DD/YYYY, hh:mm:ss A' }),
        customFormat,
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), customFormat),
        }),
        new transports.Stream({
          stream: customWritableStream,
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
