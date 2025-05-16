import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationFilterOptions } from '../interfaces/pagination-options.interface';
import { PaginationParams } from '../interfaces/pagination-params.interface';

@Injectable()
export class PaginationFilterPipe<T = any> implements PipeTransform {
    constructor(private readonly options: PaginationFilterOptions<T> = {}) {}

    transform(
        value: PaginationParams<T>,
        metadata: ArgumentMetadata,
    ): PaginationParams<T> {
        if (!value || metadata.type !== 'custom') {
            return value;
        }

        // Handle sorting
        if (
            value.sortBy &&
            this.options.allowedSortFields &&
            this.options.allowedSortFields.length > 0
        ) {
            // Validate sortBy field
            const sortBy = String(value.sortBy);
            if (!this.options.allowedSortFields.includes(sortBy as any)) {
                value.sortBy =
                    this.options.defaultSortField ||
                    (this.options.allowedSortFields[0] as any);
            }

            // Validate sortOrder
            if (
                value.sortOrder &&
                !['ASC', 'DESC'].includes(value.sortOrder.toUpperCase())
            ) {
                value.sortOrder = this.options.defaultSortOrder || 'ASC';
            }
        } else if (this.options.defaultSortField) {
            value.sortBy = this.options.defaultSortField;
            value.sortOrder = this.options.defaultSortOrder || 'ASC';
        }

        // Process filters
        if (value.filters && this.options.allowedFilterFields) {
            const validatedFilters: Record<string, any> = {};

            Object.entries(value.filters).forEach(([field, fieldValue]) => {
                if (this.options.allowedFilterFields.includes(field as any)) {
                    // Apply custom filter handlers if available
                    if (
                        this.options.customFilterHandlers &&
                        this.options.customFilterHandlers[field]
                    ) {
                        validatedFilters[field] =
                            this.options.customFilterHandlers[field](
                                fieldValue,
                            );
                    } else {
                        validatedFilters[field] = fieldValue;
                    }
                }
            });

            value.filters = validatedFilters as Partial<T>;
        }

        // Process range filters
        if (value.rangeFilters && this.options.rangeFilterFields) {
            const validatedRangeFilters: Record<string, any> = {};

            Object.entries(value.rangeFilters).forEach(([field, operators]) => {
                if (this.options.rangeFilterFields.includes(field as any)) {
                    validatedRangeFilters[field] = operators;
                }
            });

            value.rangeFilters = validatedRangeFilters;
        }

        return value;
    }
}
