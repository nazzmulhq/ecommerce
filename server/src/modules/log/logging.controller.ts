import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { LoggingService } from 'modules/log/logging.service';

@Controller('project-logs')
export class ProjectLogsController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  getHello(@Res() res: Response) {
    const logFilePath = this.loggingService.getLoggerFilePath();
    let errorLogs = fs.readFileSync(logFilePath, 'utf-8');
    errorLogs = JSON.parse(errorLogs);
    res.render('project-logs/index', {
      title: 'Error Logs',
      message: this.loggingService.getLoggerFilePath(),
      errorLogs: errorLogs,
    });
  }
}
