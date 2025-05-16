import { PaginationResponseOptions } from '../interfaces/pagination-options.interface';
import { PaginationParams } from '../interfaces/pagination-params.interface';
import {
    PaginatedResponse,
    PaginationLinks,
    PaginationMeta,
} from '../interfaces/pagination-response.interface';

/**
 * Create a standardized pagination response
 */
export function createPaginationResponse<T>(
    items: T[],
    totalItems: number,
    paginationParams: PaginationParams,
    options: PaginationResponseOptions<T> = {},
): PaginatedResponse<T> {
    const { page, limit, ...restParams } = paginationParams;

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    // Transform items if a transform function is provided
    const transformedItems = options.transform
        ? items.map(options.transform)
        : items;

    // Build meta information
    let meta: PaginationMeta = {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };

    // Add any extra meta information
    if (options.addExtraMetaInfo) {
        meta = { ...meta, ...options.addExtraMetaInfo };
    }

    // Apply meta transform if provided
    if (options.metaTransform) {
        meta = options.metaTransform(meta);
    }

    // Create response object
    const response: PaginatedResponse<T> = {
        list: transformedItems,
        meta,
    };

    // Generate links if route is provided or includeLinks is true
    if ((options.route || options.baseUrl) && options.includeLinks !== false) {
        response.links = generatePaginationLinks(
            page,
            limit,
            totalPages,
            options,
            restParams,
        );
    }

    return response;
}

/**
 * Generate pagination links
 */
function generatePaginationLinks(
    page: number,
    limit: number,
    totalPages: number,
    options: PaginationResponseOptions,
    additionalParams: Record<string, any> = {},
): PaginationLinks {
    const links: PaginationLinks = {
        current: buildUrl(page, limit, options, additionalParams),
    };

    // Add navigation links if applicable
    if (page > 1) {
        links.first = buildUrl(1, limit, options, additionalParams);
        links.previous = buildUrl(page - 1, limit, options, additionalParams);
    }

    if (page < totalPages) {
        links.next = buildUrl(page + 1, limit, options, additionalParams);
        links.last = buildUrl(totalPages, limit, options, additionalParams);
    }

    // Add custom links if provided
    if (options.customLinks) {
        Object.entries(options.customLinks).forEach(([key, value]) => {
            if (typeof value === 'function') {
                links[key] = value({
                    page,
                    limit,
                    skip: (page - 1) * limit,
                    ...additionalParams,
                });
            } else {
                links[key] = value;
            }
        });
    }

    return links;
}

/**
 * Build a URL for pagination links
 */
function buildUrl(
    page: number,
    limit: number,
    options: PaginationResponseOptions,
    additionalParams: Record<string, any> = {},
): string {
    // Use custom query builder if provided
    if (options.customQueryBuilder) {
        return options.customQueryBuilder({
            page,
            limit,
            skip: (page - 1) * limit,
            ...additionalParams,
        });
    }

    // Determine base URL
    let baseUrl = '';
    if (options.baseUrl) {
        baseUrl = options.baseUrl;
    } else if (options.route) {
        baseUrl = options.route;

        // Add route params if provided
        if (options.routeParams) {
            Object.entries(options.routeParams).forEach(([key, value]) => {
                baseUrl = baseUrl.replace(`:${key}`, encodeURIComponent(value));
            });
        }
    }

    // Start building query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Add additional query params if preserveQueryParams is true
    if (options.preserveQueryParams !== false && additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Handle nested objects (like filters)
                if (typeof value === 'object' && !Array.isArray(value)) {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        if (subValue !== undefined && subValue !== null) {
                            queryParams.append(
                                `${key}.${subKey}`,
                                subValue.toString(),
                            );
                        }
                    });
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });
    }

    return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Extract totalItems from response data
 */
export function extractTotalItems<T>(
    data: any,
    totalItemsKey?: string,
    defaultValue?: number,
): number {
    if (typeof data === 'object' && data !== null) {
        // Try to extract from meta.totalItems if it exists
        if (data.meta && typeof data.meta.totalItems === 'number') {
            return data.meta.totalItems;
        }

        // Try to extract from specified key
        if (totalItemsKey && typeof data[totalItemsKey] === 'number') {
            return data[totalItemsKey];
        }

        // For arrays, return length
        if (Array.isArray(data)) {
            return data.length;
        }

        // If the data has a count property, use that
        if (typeof data.count === 'number') {
            return data.count;
        }

        // If the data has a total property, use that
        if (typeof data.total === 'number') {
            return data.total;
        }
    }

    return defaultValue || 0;
}
