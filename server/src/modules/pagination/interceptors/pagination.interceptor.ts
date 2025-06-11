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
                // If already paginated with proper structure, just return
                if (
                    data &&
                    data.meta &&
                    typeof data.meta.totalItems === 'number'
                ) {
                    return {
                        list: data.items || data.data || data.list || [],
                        meta: data.meta,
                        links: data.links,
                    };
                }

                // Handle responses with items and total properties
                if (
                    data &&
                    typeof data === 'object' &&
                    data.items &&
                    typeof data.total === 'number'
                ) {
                    const paginationParams: PaginationParams =
                        request.paginationParams || {
                            page: 1,
                            limit: data.items.length,
                            skip: 0,
                        };

                    // Build dynamic route from request
                    const baseRoute =
                        metadata.route ||
                        `${request.protocol}://${request.get('host')}${request.path}`;

                    return createPaginationResponse(
                        data.items,
                        data.total, // Use the actual total from database
                        paginationParams,
                        {
                            route: baseRoute,
                            transform: metadata.transform,
                            preserveQueryParams:
                                metadata.preserveQueryParams ?? true,
                            includeLinks: metadata.includeLinks ?? true,
                            ...(metadata.options || {}),
                        },
                    );
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
                    const baseRoute =
                        metadata.route ||
                        `${request.protocol}://${request.get('host')}${request.path}`;

                    return createPaginationResponse(
                        data,
                        totalItems,
                        paginationParams,
                        {
                            route: baseRoute,
                            transform: metadata.transform,
                            preserveQueryParams:
                                metadata.preserveQueryParams ?? true,
                            includeLinks: metadata.includeLinks ?? true,
                            ...(metadata.options || {}),
                        },
                    );
                }

                // Handle responses with data and totalItems
                if (data && typeof data === 'object') {
                    let items = data.data || data.items || data;
                    let totalItems: number;

                    // Try to extract total items using different possible keys
                    totalItems = extractTotalItems(
                        data,
                        metadata.totalItemsKey,
                    );

                    // If we have items as an array, paginate
                    if (Array.isArray(items)) {
                        const paginationParams: PaginationParams =
                            request.paginationParams || {
                                page: 1,
                                limit: items.length,
                                skip: 0,
                            };

                        const baseRoute =
                            metadata.route ||
                            `${request.protocol}://${request.get('host')}${request.path}`;

                        return createPaginationResponse(
                            items,
                            totalItems || items.length,
                            paginationParams,
                            {
                                route: baseRoute,
                                transform: metadata.transform,
                                preserveQueryParams:
                                    metadata.preserveQueryParams ?? true,
                                includeLinks: metadata.includeLinks ?? true,
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
