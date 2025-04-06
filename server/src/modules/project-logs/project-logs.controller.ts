import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from 'modules/log/logging.service';

@Controller('project-logs')
export class ProjectLogsController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  getHello(@Res() res: Response) {
    console.log(
      'Project log controller called',
      this.loggingService.getLoggerFilePath(),
    );
    res.render('project-logs/index', {
      title: 'Project Logs',
      message: this.loggingService.getLoggerFilePath(),
    });
  }
}
