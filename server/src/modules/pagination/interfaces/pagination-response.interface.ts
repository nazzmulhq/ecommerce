export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    [key: string]: any; // For additional meta information
}

export interface PaginationLinks {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
    [key: string]: string; // For custom links
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
    links?: PaginationLinks;
    [key: string]: any; // For additional top-level properties
}
