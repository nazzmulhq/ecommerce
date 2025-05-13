import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { IMetaData } from 'types';

export class CreateRouteDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    id: number;

    @ApiProperty({ example: 'Root' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'route.root' })
    @IsString()
    message_id: string;

    @ApiProperty({ nullable: true })
    @IsNumber()
    @IsOptional()
    parent_id: number;

    @ApiProperty({ example: 'home' })
    @IsString()
    path: string;

    @ApiProperty({ example: 'guest' })
    @IsString()
    @IsOptional()
    type: string;

    @ApiProperty({ nullable: true })
    @IsString()
    @IsOptional()
    icon: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    @IsOptional()
    position: number;

    @ApiProperty({ example: [1] })
    @IsArray()
    @IsOptional()
    permissions: number[];

    @ApiProperty({
        example: {
            title: {
                default: 'Root',
                template: 'Root - {{title}}',
                absolute: 'https://example.com',
            },
            description: 'This is the root page',
        },
        description: 'Metadata for the route',
        required: false,
    })
    @IsObject()
    @ValidateNested()
    @Type(() => Object)
    @IsOptional()
    metadata: IMetaData;

    @IsOptional()
    @IsNumber()
    status: number;
}
