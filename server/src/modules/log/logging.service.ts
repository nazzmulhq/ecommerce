// logging.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
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
    const jsonStream = new CustomWritableStream(logsFilePath);

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

    const jsonFormat = format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = {
        timestamp,
        level,
        message,
      };
      if (stack) {
        logMessage['stack'] = stack;
      }
      return JSON.stringify(logMessage);
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
        new transports.Stream({ stream: combinedStream }), // Also write to combined log
      ],
    });

    this.jsonLogger = createLogger({
      ...commonOptions,
      level: 'error',
      format: jsonFormat,
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), jsonFormat),
        }),
        new transports.Stream({ stream: jsonStream }),
      ],
    });

    // get error.json file ant set logEntries
    this.jsonLogger.query({}, (err, results) => {
      if (err) {
        this.errorLogger.error('Error reading error.json file', { err });
      } else {
        this.logEntries = results.map((log) => ({
          timestamp: log.timestamp,
          level: log.level,
          message: log.message,
          context: log.context,
          stack: log.stack,
        }));
      }
    });
  }

  private addLogEntry(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    this.logEntries.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack,
    });
  }

  log(message: string, context?: string) {
    this.successLogger.info(message, { context });
    this.addLogEntry('info', message, context);
  }

  error(message: string | Error, trace?: string, context?: string) {
    if (message instanceof Error) {
      this.errorLogger.error(message.message, {
        stack: message.stack,
        context,
      });
      this.jsonLogger.error(message.message, {
        stack: message.stack,
        context,
      });
      this.addLogEntry('error', message.message, context, message.stack);
    } else {
      this.errorLogger.error(message, {
        stack: trace,
        context,
      });
      this.jsonLogger.error(message, {
        stack: trace,
        context,
      });
      this.addLogEntry('error', message, context, trace);
    }
  }

  warn(message: string, context?: string) {
    this.successLogger.warn(message, { context });
    this.addLogEntry('warn', message, context);
  }

  debug(message: string, context?: string) {
    this.successLogger.debug(message, { context });
    this.addLogEntry('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.successLogger.verbose(message, { context });
    this.addLogEntry('verbose', message, context);
  }

  getLoggerFilePath(): string {
    return path.join(this.logDirectory, 'application.log');
  }

  getLogEntries(): Array<{
    timestamp: string;
    level: string;
    message: string;
    context?: string;
    stack?: string;
  }> {
    return this.logEntries;
  }
}
