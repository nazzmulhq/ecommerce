import { Module } from '@nestjs/common';
import { LoggingService } from 'modules/log/logging.service';
import { ProjectLogsController } from './project-logs.controller';

@Module({
  imports: [],
  controllers: [ProjectLogsController],
  providers: [LoggingService],
})
export class ProjectLogsModule {}
