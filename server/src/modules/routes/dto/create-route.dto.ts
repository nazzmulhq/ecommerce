import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsJSON,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { IMetaData } from 'types';

export class CreateRouteDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    id: number;

    @ApiProperty({ example: 'Home' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Home' })
    @IsString()
    bn_name: string;

    @ApiProperty({ example: 1 })
    @IsOptional()
    parent_id: number;

    @ApiProperty({ example: 'home' })
    @IsString()
    path: string;

    @ApiProperty({ example: 'guest' })
    @IsString()
    @IsOptional()
    type: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    position: number;

    @ApiProperty({ example: [1, 2] })
    @IsArray()
    @IsOptional()
    permissions: number[];

    @ApiProperty({
        example: {
            title: {
                default: 'Home',
                template: 'Home - {{title}}',
                absolute: 'https://example.com',
            },
            description: 'This is the home page',
        },
        description: 'Metadata for the route',
        required: false,
    })
    @IsJSON()
    @IsOptional()
    metadata: IMetaData;

    @IsOptional()
    @IsNumber()
    status: number;
}
