export interface PaginationParams<T = any> {
    page: number;
    limit: number;
    skip: number;
    sortBy?: keyof T | string;
    sortOrder?: 'ASC' | 'DESC';
    filters?: Partial<T>;
    [key: string]: any; // For additional dynamic parameters
}
