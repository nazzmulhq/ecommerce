# NestJS Advanced Pagination Module - Complete Guide

This comprehensive guide covers all pagination patterns, configurations, and examples for the NestJS pagination module.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Module Configuration](#module-configuration)
3. [Basic Pagination](#basic-pagination)
4. [Auto Pagination](#auto-pagination)
5. [Filtering & Searching](#filtering--searching)
6. [Sorting](#sorting)
7. [Advanced Features](#advanced-features)
8. [TypeORM Integration](#typeorm-integration)
9. [Validation & Security](#validation--security)
10. [Performance Optimization](#performance-optimization)
11. [Real-World Examples](#real-world-examples)
12. [API Responses](#api-responses)

## Installation & Setup

### 1. Project Structure

```
src/
├── modules/
│   └── pagination/
│       ├── constants/
│       │   └── defaults.ts
│       ├── decorators/
│       │   ├── auto-paginate.decorator.ts
│       │   └── pagination.decorator.ts
│       ├── interceptors/
│       │   └── pagination.interceptor.ts
│       ├── interfaces/
│       │   ├── pagination-options.interface.ts
│       │   ├── pagination-params.interface.ts
│       │   └── pagination-response.interface.ts
│       ├── pipes/
│       │   └── pagination-filter.pipe.ts
│       ├── utils/
│       │   └── pagination.util.ts
│       └── pagination.module.ts
```

### 2. Module Registration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PaginationModule } from './modules/pagination/pagination.module';

@Module({
  imports: [
    PaginationModule.register({
      global: true,
      defaultLimit: 10,
      maxLimit: 100,
      enableInterceptor: true,
      defaultSortOrder: 'ASC',
      enableFilters: true,
      filterPrefix: 'filter.',
    }),
  ],
})
export class AppModule {}
```

## Module Configuration

### Complete Configuration Options

```typescript
// pagination.module.ts
PaginationModule.register({
  global: true, // Make module globally available
  defaultLimit: 10, // Default items per page
  maxLimit: 100, // Maximum allowed items per page
  enableInterceptor: true, // Enable automatic pagination interceptor
  defaultPageParam: 'page', // Parameter name for page number
  defaultLimitParam: 'limit', // Parameter name for page size
  defaultSortOrder: 'ASC', // Default sort order
  extractFromBody: false, // Extract params from request body
  enableFilters: true, // Enable dynamic filtering
  filterPrefix: 'filter.', // Prefix for filter parameters
  customFilterHandlers: {
    // Custom filter processing
    dateRange: (value) => parseDate(value),
    status: (value) => value.toUpperCase(),
  },
});
```

## Basic Pagination

### 1. Controller Implementation

```typescript
// articles.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  Pagination,
  PaginationParams,
  createPaginationResponse,
} from '../pagination';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Pagination() params: PaginationParams) {
    const [articles, totalCount] = await this.articleService.findAll(params);

    return createPaginationResponse(articles, totalCount, params, {
      route: '/articles',
      transform: (article) => ({
        id: article.id,
        title: article.title,
        excerpt: article.content?.substring(0, 200),
        publishedAt: article.publishedAt,
      }),
    });
  }
}
```

### 2. Service Implementation

```typescript
// article.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams } from '../pagination';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(params: PaginationParams): Promise<[Article[], number]> {
    const { skip, limit, sortBy, sortOrder, search, filters } = params;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryBuilder.andWhere(`article.${key} = :${key}`, { [key]: value });
        }
      });
    }

    // Apply sorting
    if (sortBy) {
      queryBuilder.orderBy(`article.${sortBy}`, sortOrder || 'ASC');
    } else {
      queryBuilder.orderBy('article.createdAt', 'DESC');
    }

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const results = await queryBuilder.skip(skip).take(limit).getMany();

    return [results, totalCount];
  }
}
```

## Auto Pagination

### Using AutoPaginate Decorator

```typescript
// articles.controller.ts
import { AutoPaginate } from '../pagination';

@Controller('articles')
export class ArticlesController {
  @Get('auto')
  @AutoPaginate({
    resource: 'articles',
    route: '/articles/auto',
    totalItemsKey: 'total',
  })
  async findWithAutoPagination(@Pagination() params: PaginationParams) {
    const [articles, total] = await this.articleService.findAll(params);

    // Return in format that interceptor can handle
    return {
      items: articles,
      total: total,
    };
  }

  @Get('simple-auto')
  @AutoPaginate({
    resource: 'articles',
    route: '/articles/simple-auto',
  })
  async findSimpleAuto(@Pagination() params: PaginationParams) {
    const [articles, _] = await this.articleService.findAll(params);
    return articles; // Direct array return
  }
}
```

## Filtering & Searching

### 1. Basic Filtering

```typescript
// URL: GET /articles?filter.status=PUBLISHED&filter.category=Technology

// Controller
@Get('filtered')
async findFiltered(@Pagination() params: PaginationParams) {
  // params.filters will contain: { status: 'PUBLISHED', category: 'Technology' }
  return this.articleService.findFiltered(params);
}

// Service
async findFiltered(params: PaginationParams): Promise<[Article[], number]> {
  const { filters } = params;
  const queryBuilder = this.articleRepository.createQueryBuilder('article');

  if (filters?.status) {
    queryBuilder.andWhere('article.status = :status', { status: filters.status });
  }

  if (filters?.category) {
    queryBuilder.andWhere('article.category = :category', { category: filters.category });
  }

  return queryBuilder.getManyAndCount();
}
```

### 2. Range Filtering

```typescript
// URL: GET /articles?createdAt:gte=2023-01-01&createdAt:lte=2023-12-31&views:gt=1000

// Service with range filters
async findWithRangeFilters(params: PaginationParams): Promise<[Article[], number]> {
  const { rangeFilters } = params;
  const queryBuilder = this.articleRepository.createQueryBuilder('article');

  if (rangeFilters?.createdAt) {
    if (rangeFilters.createdAt.gte) {
      queryBuilder.andWhere('article.createdAt >= :startDate', {
        startDate: rangeFilters.createdAt.gte
      });
    }
    if (rangeFilters.createdAt.lte) {
      queryBuilder.andWhere('article.createdAt <= :endDate', {
        endDate: rangeFilters.createdAt.lte
      });
    }
  }

  if (rangeFilters?.views?.gt) {
    queryBuilder.andWhere('article.views > :minViews', {
      minViews: rangeFilters.views.gt
    });
  }

  return queryBuilder.getManyAndCount();
}
```

### 3. Advanced Search

```typescript
// URL: GET /articles?search=nestjs&searchFields=title,content,tags

@Get('search')
async search(@Pagination() params: PaginationParams) {
  return this.articleService.search(params);
}

// Service
async search(params: PaginationParams): Promise<[Article[], number]> {
  const { search, searchFields } = params;
  const queryBuilder = this.articleRepository.createQueryBuilder('article');

  if (search) {
    const fields = searchFields || ['title', 'content'];
    const searchConditions = fields.map(field =>
      `article.${field} ILIKE :search`
    ).join(' OR ');

    queryBuilder.andWhere(`(${searchConditions})`, {
      search: `%${search}%`
    });
  }

  return queryBuilder
    .orderBy('article.relevanceScore', 'DESC')
    .getManyAndCount();
}
```

## Sorting

### Multiple Sort Fields

```typescript
// URL: GET /articles?sortBy=createdAt,title&sortOrder=DESC,ASC

// Service
async findWithMultipleSort(params: PaginationParams): Promise<[Article[], number]> {
  const { sortBy, sortOrder } = params;
  const queryBuilder = this.articleRepository.createQueryBuilder('article');

  if (sortBy) {
    const sortFields = Array.isArray(sortBy) ? sortBy : [sortBy];
    const sortOrders = Array.isArray(sortOrder) ? sortOrder : [sortOrder || 'ASC'];

    sortFields.forEach((field, index) => {
      const order = sortOrders[index] || 'ASC';
      if (index === 0) {
        queryBuilder.orderBy(`article.${field}`, order as 'ASC' | 'DESC');
      } else {
        queryBuilder.addOrderBy(`article.${field}`, order as 'ASC' | 'DESC');
      }
    });
  }

  return queryBuilder.getManyAndCount();
}
```

## Advanced Features

### 1. Custom Links

```typescript
// Controller with custom pagination links
@Get('with-custom-links')
async findWithCustomLinks(@Pagination() params: PaginationParams) {
  const [articles, totalCount] = await this.articleService.findAll(params);

  return createPaginationResponse(
    articles,
    totalCount,
    params,
    {
      route: '/articles',
      customLinks: {
        feed: '/articles/feed',
        featured: (params) => `/articles/featured?page=${params.page}`,
        rss: '/articles/rss',
        export: (params) => `/articles/export?format=csv&page=${params.page}`,
      },
    }
  );
}
```

### 2. Meta Transformation

```typescript
// Add extra metadata
@Get('with-stats')
async findWithStats(@Pagination() params: PaginationParams) {
  const [articles, totalCount] = await this.articleService.findAll(params);
  const stats = await this.articleService.getStats();

  return createPaginationResponse(
    articles,
    totalCount,
    params,
    {
      route: '/articles',
      addExtraMetaInfo: {
        publishedCount: stats.published,
        draftCount: stats.draft,
        avgReadTime: stats.avgReadTime,
      },
      metaTransform: (meta) => ({
        ...meta,
        readTimeEstimate: `${Math.ceil(meta.totalItems * 2)} minutes`,
      }),
    }
  );
}
```

### 3. Data Transformation

```typescript
// Transform response data
@Get('transformed')
async findTransformed(@Pagination() params: PaginationParams) {
  const [articles, totalCount] = await this.articleService.findAll(params);

  return createPaginationResponse(
    articles,
    totalCount,
    params,
    {
      route: '/articles',
      transform: (article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.content?.substring(0, 150) + '...',
        publishedAt: article.publishedAt?.toISOString(),
        author: {
          id: article.author?.id,
          name: article.author?.name,
          avatar: article.author?.avatar,
        },
        stats: {
          views: article.views,
          likes: article.likes,
          comments: article.comments?.length || 0,
        },
        tags: article.tags?.map(tag => tag.name) || [],
      }),
    }
  );
}
```

## TypeORM Integration

### 1. Complex Queries with Relations

```typescript
// Service with relations and complex filtering
async findWithRelations(params: PaginationParams): Promise<[Article[], number]> {
  const { skip, limit, filters } = params;

  const queryBuilder = this.articleRepository
    .createQueryBuilder('article')
    .leftJoinAndSelect('article.author', 'author')
    .leftJoinAndSelect('article.tags', 'tags')
    .leftJoinAndSelect('article.category', 'category')
    .leftJoinAndSelect('article.comments', 'comments');

  // Filter by author
  if (filters?.authorId) {
    queryBuilder.andWhere('author.id = :authorId', { authorId: filters.authorId });
  }

  // Filter by tags
  if (filters?.tags) {
    const tagIds = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    queryBuilder.andWhere('tags.id IN (:...tagIds)', { tagIds });
  }

  // Filter by published status
  if (filters?.published !== undefined) {
    queryBuilder.andWhere('article.publishedAt IS NOT NULL');
  }

  // Get total count
  const totalCount = await queryBuilder.getCount();

  // Apply pagination
  const articles = await queryBuilder
    .skip(skip)
    .take(limit)
    .getMany();

  return [articles, totalCount];
}
```

### 2. Raw Queries with Pagination

```typescript
// Service with raw SQL
async findWithRawQuery(params: PaginationParams): Promise<[any[], number]> {
  const { skip, limit, filters } = params;

  // Count query
  const countQuery = `
    SELECT COUNT(*) as total
    FROM articles a
    INNER JOIN users u ON a.author_id = u.id
    WHERE a.status = $1
  `;

  const countResult = await this.articleRepository.query(countQuery, ['PUBLISHED']);
  const totalCount = parseInt(countResult[0].total);

  // Data query
  const dataQuery = `
    SELECT
      a.id,
      a.title,
      a.slug,
      a.created_at,
      u.name as author_name,
      COUNT(c.id) as comment_count
    FROM articles a
    INNER JOIN users u ON a.author_id = u.id
    LEFT JOIN comments c ON a.id = c.article_id
    WHERE a.status = $1
    GROUP BY a.id, u.name
    ORDER BY a.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const articles = await this.articleRepository.query(dataQuery, [
    'PUBLISHED',
    limit,
    skip
  ]);

  return [articles, totalCount];
}
```

## Validation & Security

### 1. Using PaginationFilterPipe

```typescript
// Controller with validation
@Get('validated')
async findValidated(
  @Pagination()
  @UsePipes(new PaginationFilterPipe({
    allowedSortFields: ['id', 'title', 'createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    defaultSortOrder: 'DESC',
    allowedFilterFields: ['status', 'category', 'authorId'],
    customFilterHandlers: {
      status: (value) => value.toUpperCase(),
      category: (value) => parseInt(value),
    },
    rangeFilterFields: ['createdAt', 'views', 'likes'],
  }))
  params: PaginationParams
) {
  return this.articleService.findValidated(params);
}
```

### 2. Input Sanitization

```typescript
// Custom sanitization pipe
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(params: PaginationParams): PaginationParams {
    // Sanitize search input
    if (params.search) {
      params.search = params.search.replace(/[<>]/g, '');
    }

    // Validate sort fields
    const allowedSortFields = ['id', 'title', 'createdAt'];
    if (params.sortBy && !allowedSortFields.includes(params.sortBy as string)) {
      params.sortBy = 'createdAt';
    }

    // Limit pagination bounds
    if (params.limit > 100) {
      params.limit = 100;
    }

    return params;
  }
}
```

## Performance Optimization

### 1. Cursor-Based Pagination

```typescript
// For better performance with large datasets
@Get('cursor')
async findWithCursor(
  @Query('cursor') cursor?: string,
  @Query('limit') limit: number = 10
) {
  const queryBuilder = this.articleRepository
    .createQueryBuilder('article')
    .orderBy('article.id', 'DESC')
    .limit(limit + 1); // Get one extra to check if there's more

  if (cursor) {
    queryBuilder.where('article.id < :cursor', { cursor });
  }

  const articles = await queryBuilder.getMany();
  const hasMore = articles.length > limit;

  if (hasMore) {
    articles.pop(); // Remove the extra item
  }

  const nextCursor = hasMore ? articles[articles.length - 1].id : null;

  return {
    data: articles,
    nextCursor,
    hasMore,
  };
}
```

### 2. Caching

```typescript
// Service with caching
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAllCached(params: PaginationParams): Promise<[Article[], number]> {
    const cacheKey = `articles:${JSON.stringify(params)}`;

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as [Article[], number];
    }

    // Get from database
    const result = await this.findAll(params);

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }
}
```

## Real-World Examples

### 1. E-commerce Products

```typescript
// products.controller.ts
@Controller('products')
export class ProductsController {
  @Get()
  async findProducts(@Pagination() params: PaginationParams) {
    const [products, totalCount] = await this.productService.findAll(params);

    return createPaginationResponse(products, totalCount, params, {
      route: '/products',
      transform: (product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        discountedPrice: product.calculateDiscountedPrice(),
        imageUrl: product.images?.[0]?.url,
        rating: product.averageRating,
        inStock: product.stock > 0,
      }),
    });
  }

  @Get('search')
  async searchProducts(
    @Pagination() params: PaginationParams,
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('inStock') inStock?: boolean,
  ) {
    const searchParams = {
      ...params,
      search: query,
      filters: {
        ...params.filters,
        category,
        inStock,
      },
      rangeFilters: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    };

    return this.productService.search(searchParams);
  }
}
```

### 2. User Management

```typescript
// users.controller.ts
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AccessRoles(['admin'])
  async findUsers(@Pagination() params: PaginationParams) {
    const [users, totalCount] = await this.userService.findAll(params);

    return createPaginationResponse(users, totalCount, params, {
      route: '/users',
      transform: (user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      }),
      addExtraMetaInfo: {
        activeUsers: await this.userService.countActive(),
        newUsersThisMonth: await this.userService.countNewThisMonth(),
      },
    });
  }
}
```

### 3. Blog Posts with Categories

```typescript
// posts.controller.ts
@Controller('posts')
export class PostsController {
  @Get()
  async findPosts(@Pagination() params: PaginationParams) {
    return this.postService.findAllWithPagination(params);
  }

  @Get('by-category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Pagination() params: PaginationParams,
  ) {
    const categoryParams = {
      ...params,
      filters: { ...params.filters, categoryId },
    };

    return this.postService.findAllWithPagination(categoryParams);
  }
}

// posts.service.ts
@Injectable()
export class PostService {
  async findAllWithPagination(params: PaginationParams) {
    const [posts, totalCount] = await this.findAll(params);
    const categories = await this.categoryService.findAll();

    return createPaginationResponse(posts, totalCount, params, {
      route: '/posts',
      addExtraMetaInfo: {
        availableCategories: categories,
        featuredPostsCount: await this.countFeatured(),
      },
      customLinks: {
        featured: '/posts/featured',
        trending: '/posts/trending',
        recent: '/posts/recent',
      },
    });
  }
}
```

## API Responses

### Standard Pagination Response

```json
{
  "list": [
    {
      "id": "1",
      "title": "Getting Started with NestJS",
      "excerpt": "Learn how to build scalable Node.js applications...",
      "publishedAt": "2023-10-01T10:00:00Z",
      "author": {
        "id": "123",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "stats": {
        "views": 1250,
        "likes": 89,
        "comments": 15
      },
      "tags": ["nestjs", "nodejs", "typescript"]
    }
  ],
  "meta": {
    "totalItems": 150,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 15,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "readTimeEstimate": "300 minutes",
    "publishedCount": 120,
    "draftCount": 30,
    "avgReadTime": 8.5
  },
  "links": {
    "first": "/articles?page=1&limit=10",
    "current": "/articles?page=1&limit=10",
    "next": "/articles?page=2&limit=10",
    "last": "/articles?page=15&limit=10",
    "feed": "/articles/feed",
    "featured": "/articles/featured?page=1",
    "rss": "/articles/rss"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid pagination parameters",
  "errors": [
    {
      "field": "sortBy",
      "message": "Sort field 'invalidField' is not allowed"
    },
    {
      "field": "limit",
      "message": "Limit cannot exceed 100"
    }
  ]
}
```

This comprehensive guide covers all aspects of the pagination module, from basic setup to advanced real-world implementations. Use these examples as templates for your specific use cases.
