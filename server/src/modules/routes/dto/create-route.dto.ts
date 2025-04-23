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

    @ApiProperty({ example: 1 })
    @IsOptional()
    parentId: number;

    @ApiProperty({ example: 'home' })
    @IsString()
    path: string;

    @ApiProperty({ example: 'guest' })
    @IsString()
    @IsOptional()
    type: string;

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
            applicationName: '',
            authors: [{ name: '', url: '' }],
            generator: '',
            keywords: [''],
            referrer: 'no-referrer',
            themeColor: [
                { media: '(prefers-color-scheme: dark)', color: '#000' },
            ],
            colorScheme: 'dark light',
            creator: '',
            publisher: '',
            formatDetection: {
                email: false,
                address: false,
                telephone: false,
            },
            robots: {
                index: true,
                follow: true,
                nocache: false,
                googleBot: {
                    index: true,
                    follow: true,
                    noimageindex: false,
                },
            },
            manifest: '/manifest.json',
            metadataBase: 'https://example.com',
        },
        description: 'Metadata for the route',
        required: false,
    })
    @IsJSON()
    @IsOptional()
    metadata: IMetaData;

    @IsOptional()
    @IsNumber()
    createBy: number;

    @IsOptional()
    @IsNumber()
    updateBy: number;

    @IsOptional()
    @IsNumber()
    status: number;
}
