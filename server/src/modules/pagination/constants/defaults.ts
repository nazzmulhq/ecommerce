export const DEFAULT_PAGINATION_OPTIONS = {
    defaultPage: 1,
    defaultLimit: 5,
    maxLimit: 100,
    pageParam: 'page',
    limitParam: 'limit',
    extractFromBody: false,
    extractFromRoute: false,
    enableFilters: true,
    filterPrefix: 'filter.',
    enableRangeFilters: true,
    rangeFilterSeparator: ':',
    reservedParams: ['page', 'limit', 'sortBy', 'sortOrder'],
};

export const PAGINATION_METADATA_KEY = 'pagination:metadata';
export const PAGINATION_OPTIONS_TOKEN = 'PAGINATION_OPTIONS';
