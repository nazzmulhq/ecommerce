export const DEFAULT_PAGINATION_OPTIONS = {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
    pageParam: 'page',
    limitParam: 'pageSize', // Changed from 'limit' to 'pageSize' to match frontend
    extractFromBody: false,
    extractFromRoute: false,
    enableFilters: true,
    filterPrefix: 'filter.',
    enableRangeFilters: true,
    rangeFilterSeparator: ':',
    reservedParams: ['page', 'pageSize', 'limit', 'sortBy', 'sortOrder'], // Added 'pageSize'
};

export const PAGINATION_METADATA_KEY = 'pagination:metadata';
export const PAGINATION_OPTIONS_TOKEN = 'PAGINATION_OPTIONS';
