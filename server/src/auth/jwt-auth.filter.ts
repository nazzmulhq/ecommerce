import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
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

    response.status(401).json({
      statusCode: 401,
      message: 'JWT expired',
    });
  }
}
