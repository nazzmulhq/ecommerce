// logging.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
import { CustomWritableStream } from './custom-writable-stream';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly successLogger;
  private readonly errorLogger;
  private readonly logDirectory = path.join(process.cwd(), 'logs'); // Use process.cwd() instead of __dirname

  constructor() {
    // Ensure log directory exists

    const successLogFilePath = path.join(this.logDirectory, 'success.log');
    const errorLogFilePath = path.join(this.logDirectory, 'error.log');
    const applicationLogFilePath = path.join(
      this.logDirectory,
      'application.log',
    );

    const successStream = new CustomWritableStream(successLogFilePath);
    const errorStream = new CustomWritableStream(errorLogFilePath);
    const combinedStream = new CustomWritableStream(applicationLogFilePath);

    const errorFormat = format.printf(
      ({ timestamp, level, message, stack }) => {
        let logMessage = `${timestamp} ${level}: ${message}`;
        if (stack) {
          logMessage += `\n${stack}`;
        }
        return logMessage;
      },
    );

    const successFormat = format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    });

    const commonOptions = {
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
      ),
    };

    this.successLogger = createLogger({
      ...commonOptions,
      level: 'info',
      format: format.combine(commonOptions.format, successFormat),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), successFormat),
        }),
        new transports.Stream({ stream: successStream }),
        new transports.Stream({ stream: combinedStream }), // Also write to combined log
      ],
    });

    this.errorLogger = createLogger({
      ...commonOptions,
      level: 'error',
      format: format.combine(commonOptions.format, errorFormat),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), errorFormat),
        }),
        new transports.Stream({ stream: errorStream }),
        new transports.Stream({ stream: combinedStream }), // Also write to combined log
      ],
    });
  }

  log(message: string, context?: string) {
    this.successLogger.info(message, { context });
  }

  error(message: string | Error, trace?: string, context?: string) {
    if (message instanceof Error) {
      this.errorLogger.error(message.message, {
        stack: message.stack,
        context,
      });
    } else {
      this.errorLogger.error(message, {
        stack: trace,
        context,
      });
    }
  }

  warn(message: string, context?: string) {
    this.successLogger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.successLogger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.successLogger.verbose(message, { context });
  }

  getLoggerFilePath(): string {
    return path.join(this.logDirectory, 'application.log');
  }
}
