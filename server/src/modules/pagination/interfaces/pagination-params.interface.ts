export interface PaginationParams<T = any> {
    page: number;
    limit: number;
    skip: number;
    sortBy?: keyof T | string;
    sortOrder?: 'ASC' | 'DESC';
    filters?: Partial<T> & Record<string, any>;
    rangeFilters?: Record<string, any>;
    search?: string;
    searchFields?: string[];
    [key: string]: any; // For additional dynamic parameters
}
