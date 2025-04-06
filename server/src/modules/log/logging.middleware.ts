// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      if (statusCode >= 100 && statusCode < 300) {
        this.loggingService.log(
          `${method} ${originalUrl} ${statusCode} ${statusMessage}`,
        );
      }
      if (statusCode >= 400) {
        this.loggingService.error(
          `${method} ${originalUrl} ${statusCode} ${statusMessage}`,
        );
      }
    });
    next();
  }
}
