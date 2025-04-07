// expired.filter.ts
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { LoggingService } from 'modules/log/logging.service';
import { ExtendedCache } from 'types';

@Injectable()
@Catch()
export class ExpiredFilter extends BaseExceptionFilter {
  constructor(
    private readonly cacheManager: ExtendedCache,
    private readonly loggingService: LoggingService,
  ) {
    super();
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error details
    const errorDetails = {
      statusCode: status,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error:
        exception instanceof HttpException
          ? exception.name
          : 'InternalServerError',
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Log the exception
    if (exception instanceof Error) {
      this.loggingService.error(
        exception,
        exception.stack,
        'GlobalExceptionFilter',
      );
    } else {
      this.loggingService.error(
        'Non-Error exception thrown',
        undefined,
        'GlobalExceptionFilter',
      );
    }

    // Handle specific exceptions
    if (exception instanceof UnauthorizedException) {
      await this.cacheManager.del('user');
    }

    // Return appropriate response based on environment
    if (process.env.NODE_ENV !== 'production') {
      return response.status(status).json(errorDetails);
    }

    // Production response (don't expose stack traces)
    return response.status(status).json({
      statusCode: errorDetails.statusCode,
      message: errorDetails.message,
      error: errorDetails.error,
    });
  }
}
