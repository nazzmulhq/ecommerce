import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExtendedCache } from 'types';

@Catch(UnauthorizedException)
export class JwtExpiredFilter implements ExceptionFilter {
  constructor(private cacheManager: ExtendedCache) {}

  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    console.log('JWT expired');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    await this.cacheManager.del('user');
    console.log('exception', exception);
    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: exception.message || 'JWT expired',
      error: exception.name || 'Unauthorized',
    });
  }
}
