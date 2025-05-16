import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PAGINATION_METADATA_KEY } from '../constants/defaults';
import { PaginationInterceptorMetadata } from '../interfaces/pagination-options.interface';
import { PaginationParams } from '../interfaces/pagination-params.interface';
import {
    createPaginationResponse,
    extractTotalItems,
} from '../utils/pagination.util';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // Check if handler has pagination metadata
        const handler = context.getHandler();
        const metadata: PaginationInterceptorMetadata = Reflect.getMetadata(
            PAGINATION_METADATA_KEY,
            handler,
        );

        if (!metadata) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => {
                // If already paginated, just return
                if (data && data.meta && Array.isArray(data.data)) {
                    return data;
                }

                // Handle array responses automatically
                if (Array.isArray(data)) {
                    const paginationParams: PaginationParams =
                        request.paginationParams || {
                            page: 1,
                            limit: data.length,
                            skip: 0,
                        };

                    const totalItems = data.length;

                    return createPaginationResponse(
                        data,
                        totalItems,
                        paginationParams,
                        {
                            route: metadata.route,
                            transform: metadata.transform,
                            preserveQueryParams: true,
                            ...(metadata.options || {}),
                        },
                    );
                }

                // Handle responses with data and totalItems
                if (data && typeof data === 'object') {
                    let items = data;
                    let totalItems: number;

                    // If data has items property and it's an array, use that
                    if (data.items && Array.isArray(data.items)) {
                        items = data.items;
                        totalItems = extractTotalItems(
                            data,
                            metadata.totalItemsKey,
                            items.length,
                        );
                    } else {
                        // Try to extract total items using the provided key
                        totalItems = extractTotalItems(
                            data,
                            metadata.totalItemsKey,
                        );

                        // If we couldn't extract total items but have an array, use its length
                        if (totalItems === 0 && Array.isArray(items)) {
                            totalItems = items.length;
                        }
                    }

                    // If we have items as an array, paginate
                    if (Array.isArray(items)) {
                        const paginationParams: PaginationParams =
                            request.paginationParams || {
                                page: 1,
                                limit: items.length,
                                skip: 0,
                            };

                        return createPaginationResponse(
                            items,
                            totalItems,
                            paginationParams,
                            {
                                route: metadata.route,
                                transform: metadata.transform,
                                preserveQueryParams: true,
                                ...(metadata.options || {}),
                            },
                        );
                    }
                }

                // Default: return unchanged
                return data;
            }),
        );
    }
}
