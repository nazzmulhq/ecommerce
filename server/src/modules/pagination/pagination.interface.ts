// pagination.interface.ts
export interface PaginationResult<T> {
    data: T[];
    page: number;
    limit: number;
    totalCount: number;
}
