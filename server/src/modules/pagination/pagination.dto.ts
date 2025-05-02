// pagination.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page = 1;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit = 10;

    get skip() {
        return (this.page - 1) * this.limit;
    }
}
