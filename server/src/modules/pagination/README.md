# NestJS Advanced Pagination Module Guide

This comprehensive guide explains how to use the enhanced pagination module for NestJS applications. The module provides a flexible and powerful way to handle pagination across your application.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Module Configuration](#module-configuration)
4. [Features](#features)
5. [Advanced Usage](#advanced-usage)
6. [TypeORM Integration](#typeorm-integration)
7. [GraphQL Support](#graphql-support)
8. [Examples](#examples)

## Installation

```bash
npm install nestjs-advanced-pagination
```

## Basic Usage

### 1. Register the module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PaginationModule } from 'nestjs-advanced-pagination';

@Module({
  imports: [
    PaginationModule.register({
      global: true,
      defaultLimit: 10,
      maxLimit: 100,
    }),
    // Other modules...
  ],
})
export class AppModule {}
```

### 2. Use the pagination decorator in your controller

```typescript
// articles.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Pagination, PaginationParams, createPaginationResponse } from 'nestjs-advanced-pagination';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Pagination() paginationParams: PaginationParams) {
    const [articles, totalCount] = await this.articleService.findAll(paginationParams);
    
    return createPaginationResponse(
      articles,
      totalCount,
      paginationParams,
      { route: '/articles' }
    );
  }
}
```

### 3. Implement pagination in your service

```typescript
// article.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams } from 'nestjs-advanced-pagination';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>
  ) {}

  async findAll(params: PaginationParams): Promise<[Article[], number]> {
    const { skip, limit, sortBy, sortOrder } = params;
    
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    
    if (sortBy) {
      queryBuilder.orderBy(`article.${sortBy}`, sortOrder || 'ASC');
    }
    
    return queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }
}
```

## Module Configuration

The pagination module can be configured with the following options:

```typescript
PaginationModule.register({
  global: true,                    // Make the module globally available
  defaultLimit: 10,                // Default items per page
  maxLimit: 100,                   // Maximum allowed items per page
  enableInterceptor: true,         // Enable automatic pagination interceptor
  defaultPageParam: 'page',        // Parameter name for page
  defaultLimitParam: 'limit',      // Parameter name for limit
  defaultSortOrder: 'ASC',         // Default sort order
  extractFromBody: false,          // Extract pagination params from request body
  enableFilters: true,             // Enable filter parameters
  filterPrefix: 'filter.',         // Prefix for filter parameters
})
```

## Features

### Pagination Parameters

The `@Pagination()` decorator extracts pagination parameters from various sources:

- Query parameters: `?page=2&limit=10&sortBy=createdAt&sortOrder=DESC`
- Route parameters (if enabled): `/articles/page/2/limit/10`
- Body parameters (if enabled): `{ "page": 2, "limit": 10 }`

### Filtering

The module supports dynamic filtering with:

- Simple filters: `?filter.status=PUBLISHED`
- Range filters: `?createdAt:gt=2023-01-01&createdAt:lt=2023-12-31`
- Custom filters: Implement your own filter handling logic

### Sorting

Sort results with:
- Sort field: `?sortBy=createdAt`
- Sort direction: `?sortOrder=DESC`

### Auto-Pagination

Automatically paginate array responses with the `@AutoPaginate()` decorator:

```typescript
@Get('auto')
@AutoPaginate({
  resource: 'articles',
  route: '/articles/auto',
})
async findWithAutoPagination(@Pagination() params: PaginationParams) {
  const [articles, _] = await this.articleService.findAll(params);
  return articles; // Automatically converted to a paginated response
}
```

## Advanced Usage

### Use with Validation Pipe

Combine with `PaginationFilterPipe` to validate and filter pagination parameters:

```typescript
@Get()
async findAll(
  @Pagination() 
  @PaginationFilterPipe({
    allowedSortFields: ['id', 'title', 'createdAt'],
    defaultSortField: 'createdAt',
    allowedFilterFields: ['status', 'author'],
  })
  params: PaginationParams
) {
  // Implementation...
}
```

### Custom Response Transformation

Transform each item in the response:

```typescript
return createPaginationResponse(
  articles,
  totalCount,
  paginationParams,
  {
    route: '/articles',
    transform: (article) => ({
      id: article.id,
      title: article.title,
      // Include only needed fields
    }),
  }
);
```

### Custom Links

Add custom pagination links:

```typescript
return createPaginationResponse(
  articles,
  totalCount,
  paginationParams,
  {
    route: '/articles',
    customLinks: {
      feed: '/articles/feed',
      featured: (params) => `/articles/featured?page=${params.page}`,
    },
  }
);
```

## TypeORM Integration

The pagination module works seamlessly with TypeORM:

```typescript
async findAll(params: PaginationParams): Promise<[Article[], number]> {
  const { skip, limit, sortBy, sortOrder, filters } = params;
  
  const queryBuilder = this.articleRepository.createQueryBuilder('article');
  
  // Apply filters dynamically
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      queryBuilder.andWhere(`article.${key} = :${key}`, { [key]: value });
    });
  }
  
  // Apply sorting
  if (sortBy) {
    queryBuilder.orderBy(`article.${sortBy}`, sortOrder || 'ASC');
  }
  
  // Apply pagination
  return queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();
}
```

## GraphQL Support

The pagination module can be used with GraphQL by converting the PaginationParams:

```typescript
@Query(() => PaginatedArticlesResponse)
async articles(
  @Args() args: PaginationArgs
): Promise<PaginatedArticlesResponse> {
  const paginationParams: PaginationParams = {
    page: args.page,
    limit: args.limit,
    skip: (args.page - 1) * args.limit,
    // Additional parameters...
  };
  
  const [articles, totalItems] = await this.articleService.findAll(paginationParams);
  
  return {
    data: articles,
    totalItems,
    itemCount: articles.length,
    itemsPerPage: args.limit,
    totalPages: Math.ceil(totalItems / args.limit),
    currentPage: args.page,
  };
}
```

## Examples

### Basic Pagination

```
GET /articles?page=2&limit=10
```

Response:
```json
{
  "data": [
    { "id": "1", "title": "Article 1" },
    { "id": "2", "title": "Article 2" }
  ],
  "meta": {
    "totalItems": 100,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 2,
    "hasNextPage": true,
    "hasPreviousPage": true
  },
  "links": {
    "first": "/articles?page=1&limit=10",
    "previous": "/articles?page=1&limit=10",
    "current": "/articles?page=2&limit=10",
    "next": "/articles?page=3&limit=10",
    "last": "/articles?page=10&limit=10"
  }
}
```

### Filtering

```
GET /articles?filter.status=PUBLISHED&filter.author=John
```

### Range Filtering

```
GET /articles?createdAt:gt=2023-01-01&createdAt:lt=2023-12-31
```

### Sorting

```
GET /articles?sortBy=createdAt&sortOrder=DESC
```

### Search with Multiple Parameters

```
GET /articles/search?searchTerm=NestJS&categories[]=Tutorial&categories[]=Guide
```

The pagination module provides a flexible and powerful way to handle pagination across your NestJS application, making it easier to create consistent API responses.
