import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DEFAULT_PAGINATION_OPTIONS } from '../constants/defaults';
import { PaginationDecoratorOptions } from '../interfaces/pagination-options.interface';
import { PaginationParams } from '../interfaces/pagination-params.interface';

/**
 * Extract and process pagination parameters from the request
 */
export const Pagination = createParamDecorator(
    (
        options: PaginationDecoratorOptions = {},
        ctx: ExecutionContext,
    ): PaginationParams => {
        const request: Request = ctx.switchToHttp().getRequest();
        const mergedOptions = { ...DEFAULT_PAGINATION_OPTIONS, ...options };

        const {
            defaultPage,
            defaultLimit,
            maxLimit,
            pageParam,
            limitParam,
            extractFromBody,
            extractFromRoute,
            enableFilters,
            filterPrefix,
            enableRangeFilters,
            rangeFilterSeparator,
            reservedParams,
        } = mergedOptions;

        // Initialize params object
        const params: Record<string, any> = {};

        // Extract pagination parameters from various sources
        let pageValue, limitValue, sortByValue, sortOrderValue;

        // Extract from route parameters
        if (extractFromRoute && request.params) {
            pageValue = request.params[pageParam];
            limitValue = request.params[limitParam];

            // Extract other parameters from route
            Object.keys(request.params).forEach((key) => {
                if (!reservedParams.includes(key)) {
                    params[key] = request.params[key];
                }
            });
        }

        // Extract from query parameters (takes precedence over route)
        if (request.query) {
            if (request.query[pageParam] !== undefined) {
                pageValue = request.query[pageParam];
            }

            if (request.query[limitParam] !== undefined) {
                limitValue = request.query[limitParam];
            }

            if (request.query.sortBy !== undefined) {
                sortByValue = request.query.sortBy;
            }

            if (request.query.sortOrder !== undefined) {
                sortOrderValue = request.query.sortOrder;
            }

            // Process filters if enabled
            if (enableFilters) {
                const filters = {};
                const rangeFilters = {};

                Object.keys(request.query).forEach((key) => {
                    // Skip reserved parameters
                    if (reservedParams.includes(key)) {
                        return;
                    }

                    // Handle prefixed filters
                    if (key.startsWith(filterPrefix)) {
                        const filterName = key.substring(filterPrefix.length);
                        filters[filterName] = request.query[key];
                        return;
                    }

                    // Handle range filters
                    if (
                        enableRangeFilters &&
                        key.includes(rangeFilterSeparator)
                    ) {
                        const [fieldName, operator] =
                            key.split(rangeFilterSeparator);

                        if (!rangeFilters[fieldName]) {
                            rangeFilters[fieldName] = {};
                        }

                        rangeFilters[fieldName][operator] = request.query[key];
                        return;
                    }

                    // Add as regular parameter
                    params[key] = request.query[key];
                });

                // Add processed filters to params
                if (Object.keys(filters).length > 0) {
                    params.filters = filters;
                }

                if (Object.keys(rangeFilters).length > 0) {
                    params.rangeFilters = rangeFilters;
                }
            } else {
                // Just collect all parameters
                Object.keys(request.query).forEach((key) => {
                    if (!reservedParams.includes(key)) {
                        params[key] = request.query[key];
                    }
                });
            }
        }

        // Extract from body parameters (highest precedence)
        if (extractFromBody && request.body) {
            if (request.body[pageParam] !== undefined) {
                pageValue = request.body[pageParam];
            }

            if (request.body[limitParam] !== undefined) {
                limitValue = request.body[limitParam];
            }

            if (request.body.sortBy !== undefined) {
                sortByValue = request.body.sortBy;
            }

            if (request.body.sortOrder !== undefined) {
                sortOrderValue = request.body.sortOrder;
            }

            // Extract filters from body if enabled
            if (enableFilters && request.body.filters) {
                params.filters = request.body.filters;
            }

            if (enableFilters && request.body.rangeFilters) {
                params.rangeFilters = request.body.rangeFilters;
            }
        }

        // Parse and validate page
        let page = parsePositiveInt(pageValue, defaultPage);

        // Parse and validate limit
        let limit = parsePositiveInt(limitValue, defaultLimit);
        if (limit > maxLimit) {
            limit = maxLimit;
        }

        // Calculate skip for database query
        const skip = (page - 1) * limit;

        // Create pagination parameters object
        const paginationParams: PaginationParams = {
            page,
            limit,
            skip,
            ...params,
        };

        // Add sorting if provided
        if (sortByValue) {
            paginationParams.sortBy = sortByValue.toString();

            // Validate sortOrder
            if (sortOrderValue) {
                const upperSortOrder = sortOrderValue.toString().toUpperCase();
                paginationParams.sortOrder = ['ASC', 'DESC'].includes(
                    upperSortOrder,
                )
                    ? (upperSortOrder as 'ASC' | 'DESC')
                    : 'ASC';
            }
        }

        // Store pagination params in request for interceptors
        request['paginationParams'] = paginationParams;

        return paginationParams;
    },
);

/**
 * Helper to parse and validate positive integers
 */
function parsePositiveInt(value: any, defaultValue: number): number {
    const parsed = Number(value);
    return !isNaN(parsed) && parsed > 0 ? parsed : defaultValue;
}
