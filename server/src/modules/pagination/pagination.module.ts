import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PAGINATION_OPTIONS_TOKEN } from './constants/defaults';
import { PaginationInterceptor } from './interceptors/pagination.interceptor';
import { PaginationModuleOptions } from './interfaces/pagination-options.interface';

@Module({})
export class PaginationModule {
    static register(options: PaginationModuleOptions = {}): DynamicModule {
        const providers: Provider[] = [
            {
                provide: PAGINATION_OPTIONS_TOKEN,
                useValue: options,
            },
        ];

        if (options.enableInterceptor) {
            providers.push({
                provide: APP_INTERCEPTOR,
                useClass: PaginationInterceptor,
            });
        }

        return {
            module: PaginationModule,
            global: options.global || false,
            providers,
            exports: providers,
        };
    }
}
