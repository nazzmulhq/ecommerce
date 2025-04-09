import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Route } from 'modules/routes/entities/route.entity';
import { IMetaData } from 'types';

export class CreateRouteDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ example: 'Home' })
  @IsString()
  name: string;

  @ApiProperty({ example: null })
  @IsOptional()
  parent: Route;

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
      applicationName: 'My App',
      authors: [{ name: 'John Doe', url: 'https://example.com' }],
      generator: 'My Generator',
      keywords: ['home', 'page'],
      referrer: 'no-referrer',
      themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#000' }],
      colorScheme: 'dark light',
      creator: 'John Doe',
      publisher: 'My Company',
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
      icons: {
        icon: [{ url: '/icon.png' }],
        shortcut: ['/shortcut-icon.png'],
        apple: [
          { url: '/apple-icon.png', sizes: '192x192', type: 'image/png' },
          { url: '/apple-icon2.png', sizes: '512x512', type: 'image/png' },
        ],
        other: [{ rel: 'apple-touch-icon', url: '/apple-icon.png' }],
      },
      openGraph: {
        title: 'Home',
        description: 'This is the home page',
        url: 'https://example.com',
        siteName: 'My Site',
        images: [
          {
            url: 'https://example.com/image.png',
            width: 800,
            height: 600,
            alt: 'An image',
            type: 'image/png',
          },
        ],
        locale: 'en_US',
        type: 'website',
        publishedTime: '2023-01-01T00:00:00Z',
        authors: ['John Doe'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Home',
        description: 'This is the home page',
        siteId: '123456789',
        creator: '@johndoe',
        creatorId: '123456789',
        images: ['https://example.com/twitter-image.png'],
      },
      alternates: {
        en: '/en',
      },
      verification: {
        google: 'google-site-verification-code',
        yandex: 'yandex-verification-code',
        other: [{ id: 'other-verification-code', type: 'other' }],
      },
      appLinks: {
        web: { url: 'https://example.com', should_fallback: true },
        ios: { url: 'https://example.com', app_store_id: '123456789' },
        android: { url: 'https://example.com', package: 'com.example.app' },
        windows: { url: 'https://example.com', app_id: '123456789' },
        universal: { url: 'https://example.com', app_id: '123456789' },
        webApp: { url: 'https://example.com', should_fallback: true },
        other: [
          { url: 'https://example.com', app_id: '123456789' },
          { url: 'https://example.com', app_store_id: '123456789' },
          { url: 'https://example.com', package: 'com.example.app' },
          { url: 'https://example.com', app_id: '123456789' },
          { url: 'https://example.com', app_store_id: '123456789' },
          { url: 'https://example.com', package: 'com.example.app' },
          { url: 'https://example.com', app_id: '123456789' },
          { url: 'https://example.com', app_store_id: '123456789' },
        ],
      },
      archives: [
        'https://example.com/archive1',
        'https://example.com/archive2',
      ],
      assets: ['https://example.com/asset1', 'https://example.com/asset2'],
      bookmarks: [
        'https://example.com/bookmark1',
        'https://example.com/bookmark2',
      ],
      category: 'category',
      appleWebApp: {
        capable: true,
        title: 'My App',
      },
      itunes: {
        appId: '123456789',
        appArgument: 'my-app-argument',
      },
      abstract: 'This is an abstract',
      classification: 'This is a classification',
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
