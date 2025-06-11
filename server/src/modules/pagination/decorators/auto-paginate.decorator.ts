import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { PAGINATION_METADATA_KEY } from '../constants/defaults';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { PaginationInterceptorMetadata } from '../interfaces/pagination-options.interface';

/**
 * Decorator to automatically paginate responses with dynamic options
 */
export function AutoPaginate<T = any>(
    metadata: PaginationInterceptorMetadata<T> & {
        totalItemsKey?: string;
        dynamicRoute?: boolean;
        preserveQueryParams?: boolean;
        includeLinks?: boolean;
    },
) {
    return applyDecorators(
        SetMetadata(PAGINATION_METADATA_KEY, {
            totalItemsKey: 'total', // Default key for total items
            dynamicRoute: true, // Enable dynamic route building
            preserveQueryParams: true, // Preserve query parameters in links
            includeLinks: true, // Include pagination links
            ...metadata,
        }),
        UseInterceptors(PaginationInterceptor),
    );
}
