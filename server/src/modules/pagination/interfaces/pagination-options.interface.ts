import { PaginationParams } from './pagination-params.interface';
import { PaginationMeta } from './pagination-response.interface';

export interface PaginationDecoratorOptions {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
    pageParam?: string;
    limitParam?: string;
    extractFromBody?: boolean;
    extractFromRoute?: boolean;
    enableFilters?: boolean;
    filterPrefix?: string;
    enableRangeFilters?: boolean;
    rangeFilterSeparator?: string;
    reservedParams?: string[];
}

export interface PaginationFilterOptions<T = any> {
    allowedSortFields?: Array<keyof T | string>;
    defaultSortField?: keyof T | string;
    defaultSortOrder?: 'ASC' | 'DESC';
    allowedFilterFields?: Array<keyof T | string>;
    customFilterHandlers?: Record<string, (value: any) => any>;
    rangeFilterFields?: Array<keyof T | string>;
}

export interface PaginationResponseOptions<T = any> {
    route?: string;
    baseUrl?: string;
    routeParams?: Record<string, string>;
    transform?: (item: T) => any;
    metaTransform?: (meta: PaginationMeta) => PaginationMeta;
    includeLinks?: boolean;
    customLinks?: Record<
        string,
        string | ((params: PaginationParams<T>) => string)
    >;
    preserveQueryParams?: boolean;
    customQueryBuilder?: (params: PaginationParams<T>) => string;
    addExtraMetaInfo?: Record<string, any>;
}

export interface PaginationModuleOptions {
    global?: boolean;
    defaultLimit?: number;
    maxLimit?: number;
    enableInterceptor?: boolean;
    defaultPageParam?: string;
    defaultLimitParam?: string;
    defaultSortOrder?: 'ASC' | 'DESC';
    extractFromBody?: boolean;
    enableFilters?: boolean;
    filterPrefix?: string;
    customFilterHandlers?: Record<string, (value: any) => any>;
}

export interface PaginationInterceptorMetadata<T = any> {
    resource: string;
    route?: string;
    totalItemsKey?: string;
    transform?: (item: T) => any;
    options?: PaginationResponseOptions<T>;
}
