// src/common/filters/http-exception.filter.ts
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message =
                typeof errorResponse === 'string'
                    ? errorResponse
                    : errorResponse['message'] || exception.message;
        }

        response.status(status).json({
            statusCode: status,
            message,
            data: null,
            success: false,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
