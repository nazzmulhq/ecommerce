import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { PaginationModule } from 'modules/pagination/pagination.module';
import { RabbitmqModule } from 'modules/rabbitmq/rabbitmq.module';
import {
    WinstonModule,
    utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [
                join(process.cwd(), 'dist/modules/**/*.entity{.ts,.js}'),
            ],
            synchronize: true,
            logging: true,
            autoLoadEntities: true,
            migrations: [join(process.cwd(), 'dist/migrations/*{.ts,.js}')],
            migrationsRun: true,
            migrationsTableName: 'typeorm_migrations',
        }),
        MongooseModule.forRoot(process.env.MONGO_DB_URL),
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: 'redis',
            port: 6379,
        }),
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike('App', {
                            colors: true,
                            prettyPrint: true,
                            processId: true,
                        }),
                    ),
                }),
            ],
        }),

        RabbitmqModule,
        PaginationModule,
    ],
})
export class ConfigurationModule {}
