// logging.service.ts
import { HttpException, Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
import { SafeArrayTransport } from './custom-array.transport';
import { CustomWritableStream } from './custom-writable-stream';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly successLogger;
  private readonly errorLogger;
  private readonly jsonLogger;
  private readonly logDirectory = path.join(process.cwd(), 'logs'); // Use process.cwd() instead of __dirname
  private readonly logEntries: Array<{
    timestamp: string;
    level: string;
    message: string;
    context?: string;
    stack?: string;
  }> = []; // In-memory log storage

  constructor() {
    // Ensure log directory exists

    const successLogFilePath = path.join(this.logDirectory, 'success.log');
    const errorLogFilePath = path.join(this.logDirectory, 'error.log');
    const applicationLogFilePath = path.join(
      this.logDirectory,
      'application.log',
    );
    const logsFilePath = path.join(this.logDirectory, 'error.json');

    const successStream = new CustomWritableStream(successLogFilePath);
    const errorStream = new CustomWritableStream(errorLogFilePath);
    const combinedStream = new CustomWritableStream(applicationLogFilePath);
    const jsonStream = new SafeArrayTransport(logsFilePath);

    const successFormat = format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    });

    const errorFormat = format.printf(
      ({ timestamp, level, message, stack }) => {
        let logMessage = `${timestamp} ${level}: ${message}`;
        if (stack) {
          logMessage += `\n${stack}`;
        }
        return logMessage;
      },
    );

    const jsonFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),

      format.json(),
    );
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
        new transports.Stream({ stream: combinedStream }),
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
        new transports.Stream({ stream: combinedStream }),
      ],
    });

    this.jsonLogger = createLogger({
      level: 'error',
      format: jsonFormat,
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
        new transports.Stream({
          stream: jsonStream,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.successLogger.info(message, { context });
  }

  error(error: Error | HttpException | string, request?: Request) {
    if (typeof error === 'string') {
      this.errorLogger.error({
        level: 'error',
        message: error,
        stack: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const logPayload = {
      level: 'error',
      statusCode: error instanceof HttpException ? error.getStatus() : 500,
      message: error.message,
      error: error.name,
      stack: error.stack,
      path: request?.url,
      method: request?.method,
      ip: request['ip'],
      userAgent: request?.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };

    this.errorLogger.error(logPayload);

    this.jsonLogger.error(logPayload);
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
    return path.join(this.logDirectory, 'error.json');
  }
}
