import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { PAGINATION_METADATA_KEY } from '../constants/defaults';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { PaginationInterceptorMetadata } from '../interfaces/pagination-options.interface';

/**
 * Decorator to automatically paginate responses
 */
export function AutoPaginate<T = any>(
    metadata: PaginationInterceptorMetadata<T> & { totalItemsKey?: string },
) {
    return applyDecorators(
        SetMetadata(PAGINATION_METADATA_KEY, {
            totalItemsKey: 'total', // Default key for total items
            ...metadata,
        }),
        UseInterceptors(PaginationInterceptor),
    );
}
