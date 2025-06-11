import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({
        example: 'create',
    })
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    created_by: number;

    @IsOptional()
    @IsNumber()
    updated_by: number;

    @IsOptional()
    @IsNumber()
    status: number;

    @IsOptional()
    @IsString()
    created_at: Date;

    @IsOptional()
    @IsString()
    updated_at: Date;
}
