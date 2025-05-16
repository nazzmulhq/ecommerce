import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigurationModule } from 'modules/configuration/configuration.module';
import { ProjectLogsModule } from 'modules/log/logging.module';
import { RouteModule } from 'modules/routes/routes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './log/logging.middleware';
import { LoggingService } from './log/logging.service';

@Module({
    imports: [ConfigurationModule, AuthModule, RouteModule, ProjectLogsModule],
    controllers: [AppController],
    providers: [AppService, LoggingService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
