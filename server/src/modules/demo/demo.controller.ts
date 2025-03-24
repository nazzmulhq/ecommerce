import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('demo')
export class DemoController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    res.render('demo/index', {
      title: 'Demo',
      message: 'Swagger UI is available at /api-docs',
    });
  }
}
