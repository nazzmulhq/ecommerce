# NestJS Advanced Pagination Module - Complete Implementation Guide

This guide provides step-by-step instructions for implementing the pagination module with real-world examples and best practices.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation & Setup](#installation--setup)
3. [Basic Implementation](#basic-implementation)
4. [Auto Pagination](#auto-pagination)
5. [Advanced Filtering](#advanced-filtering)
6. [Frontend Integration](#frontend-integration)
7. [Complete CRUD Example](#complete-crud-example)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Quick Start

### 1. Basic Controller Setup

```typescript
// product.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AutoPaginate, Pagination, PaginationParams } from '../pagination';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @AutoPaginate({
    resource: 'products',
    route: '/products',
    totalItemsKey: 'total',
  })
  async findAll(@Pagination() params: PaginationParams) {
    const [products, total] = await this.productService.findAll(params);

    return {
      items: products,
      total: total,
    };
  }
}
```

### 2. Basic Service Implementation

```typescript
// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams } from '../pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(params: PaginationParams): Promise<[Product[], number]> {
    const { skip, limit, sortBy = 'created_at', sortOrder = 'DESC' } = params;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.deleted = 0');

    // Apply sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Get total count BEFORE pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const products = await queryBuilder.skip(skip).take(limit).getMany();

    return [products, totalCount];
  }
}
```

### 3. Module Registration

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
      defaultLimitParam: 'pageSize', // Use 'pageSize' instead of 'limit'
    }),
  ],
})
export class AppModule {}
```

That's it! Your API will now respond to URLs like:

- `GET /products?page=1&pageSize=10`
- `GET /products?page=2&pageSize=20&sortBy=name&sortOrder=ASC`

## Installation & Setup

### Project Structure

Create the following directory structure in your NestJS project:

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
│       ├── pagination.module.ts
│       └── README.md
```

### Constants File

```typescript
// filepath: /home/nazmul/Documents/me/ecommerce/server/src/modules/pagination/constants/defaults.ts
export const DEFAULT_PAGINATION_OPTIONS = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
  pageParam: 'page',
  limitParam: 'pageSize', // Changed to 'pageSize'
  extractFromBody: false,
  extractFromRoute: false,
  enableFilters: true,
  filterPrefix: 'filter.',
  enableRangeFilters: true,
  rangeFilterSeparator: ':',
  reservedParams: ['page', 'pageSize', 'limit', 'sortBy', 'sortOrder'],
};

export const PAGINATION_METADATA_KEY = 'pagination:metadata';
export const PAGINATION_OPTIONS_TOKEN = 'PAGINATION_OPTIONS';
```

## Basic Implementation

### Step 1: Create Entity

```typescript
// product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Step 2: Enhanced Service with Filtering

```typescript
// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParams } from '../pagination';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(params: PaginationParams): Promise<[Product[], number]> {
    const {
      skip,
      limit,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      search,
      filters,
      name,
      category,
    } = params;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.deleted = 0');

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.category ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply direct filters (for backward compatibility)
    if (name) {
      queryBuilder.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    // Apply filters from filters object
    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'minPrice') {
            queryBuilder.andWhere('product.price >= :minPrice', {
              minPrice: value,
            });
          } else if (key === 'maxPrice') {
            queryBuilder.andWhere('product.price <= :maxPrice', {
              maxPrice: value,
            });
          } else if (key === 'inStock') {
            queryBuilder.andWhere('product.stock > 0');
          } else {
            queryBuilder.andWhere(`product.${key} = :${key}`, { [key]: value });
          }
        }
      });
    }

    // Apply sorting
    if (sortBy && typeof sortBy !== 'symbol' && sortOrder) {
      queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('product.created_at', 'DESC');
    }

    // Get total count BEFORE applying pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const products = await queryBuilder.skip(skip).take(limit).getMany();

    return [products, totalCount];
  }

  async findByCategory(
    category: string,
    params: PaginationParams,
  ): Promise<[Product[], number]> {
    const categoryParams = {
      ...params,
      filters: { ...params.filters, category },
    };
    return this.findAll(categoryParams);
  }

  async search(
    query: string,
    params: PaginationParams,
  ): Promise<[Product[], number]> {
    const searchParams = {
      ...params,
      search: query,
    };
    return this.findAll(searchParams);
  }
}
```

### Step 3: Complete Controller

```typescript
// product.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AutoPaginate, Pagination, PaginationParams } from '../pagination';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'ASC' })
  @ApiQuery({ name: 'search', required: false, example: 'laptop' })
  @ApiQuery({ name: 'category', required: false, example: 'electronics' })
  @AutoPaginate({
    resource: 'products',
    route: '/products',
    totalItemsKey: 'total',
    dynamicRoute: true,
    preserveQueryParams: true,
    includeLinks: true,
  })
  async findAll(
    @Pagination({
      defaultLimit: 10,
      maxLimit: 100,
      enableFilters: true,
    })
    params: PaginationParams,
  ) {
    const [products, total] = await this.productService.findAll(params);

    return {
      items: products,
      total: total,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @AutoPaginate({
    resource: 'products',
    route: '/products/search',
    totalItemsKey: 'total',
  })
  async search(
    @Query('q') query: string,
    @Pagination() params: PaginationParams,
  ) {
    const [products, total] = await this.productService.search(query, params);

    return {
      items: products,
      total: total,
    };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @AutoPaginate({
    resource: 'products',
    route: '/products/category',
    totalItemsKey: 'total',
  })
  async findByCategory(
    @Param('category') category: string,
    @Pagination() params: PaginationParams,
  ) {
    const [products, total] = await this.productService.findByCategory(
      category,
      params,
    );

    return {
      items: products,
      total: total,
    };
  }
}
```

## Auto Pagination

### Simple Auto Pagination

```typescript
// Simple controller that returns direct array
@Controller('categories')
export class CategoryController {
  @Get()
  @AutoPaginate({
    resource: 'categories',
    route: '/categories',
  })
  async findAll(@Pagination() params: PaginationParams) {
    const [categories, _] = await this.categoryService.findAll(params);
    return categories; // Direct array return - interceptor handles pagination
  }
}
```

### Advanced Auto Pagination with Custom Options

```typescript
@Controller('orders')
export class OrderController {
  @Get()
  @AutoPaginate({
    resource: 'orders',
    route: '/orders',
    totalItemsKey: 'total',
    dynamicRoute: true,
    preserveQueryParams: true,
    includeLinks: true,
    options: {
      transform: (order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      }),
      customLinks: {
        export: '/orders/export',
        analytics: '/orders/analytics',
      },
      addExtraMetaInfo: {
        totalRevenue: 0, // Will be calculated in service
        averageOrderValue: 0,
      },
    },
  })
  async findAll(@Pagination() params: PaginationParams) {
    const [orders, total] = await this.orderService.findAll(params);
    const stats = await this.orderService.getOrderStats();

    return {
      items: orders,
      total: total,
      totalRevenue: stats.totalRevenue,
      averageOrderValue: stats.averageOrderValue,
    };
  }
}
```

## Advanced Filtering

### Range Filters

```typescript
// URL: GET /products?price:gte=100&price:lte=500&stock:gt=0&created_at:gte=2023-01-01

// Service implementation
async findWithRangeFilters(params: PaginationParams): Promise<[Product[], number]> {
  const { rangeFilters } = params;
  const queryBuilder = this.productRepository.createQueryBuilder('product');

  if (rangeFilters?.price) {
    if (rangeFilters.price.gte) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: rangeFilters.price.gte
      });
    }
    if (rangeFilters.price.lte) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: rangeFilters.price.lte
      });
    }
  }

  if (rangeFilters?.stock?.gt) {
    queryBuilder.andWhere('product.stock > :minStock', {
      minStock: rangeFilters.stock.gt
    });
  }

  if (rangeFilters?.created_at?.gte) {
    queryBuilder.andWhere('product.created_at >= :startDate', {
      startDate: rangeFilters.created_at.gte
    });
  }

  return queryBuilder.getManyAndCount();
}
```

### Complex Filtering with Relations

```typescript
// Service with relations and complex filters
async findWithRelations(params: PaginationParams): Promise<[Product[], number]> {
  const { skip, limit, filters } = params;

  const queryBuilder = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.supplier', 'supplier')
    .leftJoinAndSelect('product.reviews', 'reviews')
    .where('product.deleted = 0');

  // Filter by supplier
  if (filters?.supplierId) {
    queryBuilder.andWhere('supplier.id = :supplierId', {
      supplierId: filters.supplierId
    });
  }

  // Filter by category
  if (filters?.categoryName) {
    queryBuilder.andWhere('category.name = :categoryName', {
      categoryName: filters.categoryName
    });
  }

  // Filter by rating
  if (filters?.minRating) {
    queryBuilder.andWhere(
      '(SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = product.id) >= :minRating',
      { minRating: filters.minRating }
    );
  }

  // Get total count
  const totalCount = await queryBuilder.getCount();

  // Apply pagination
  const products = await queryBuilder
    .skip(skip)
    .take(limit)
    .getMany();

  return [products, totalCount];
}
```

### Input Validation and Sanitization

```typescript
// Controller with validation
@Controller('products')
export class ProductController {
  @Get('validated')
  async findValidated(
    @Pagination()
    @UsePipes(
      new PaginationFilterPipe({
        allowedSortFields: ['id', 'name', 'price', 'created_at'],
        defaultSortField: 'created_at',
        defaultSortOrder: 'DESC',
        allowedFilterFields: ['category', 'supplierId', 'inStock'],
        customFilterHandlers: {
          category: (value) => value.toLowerCase(),
          price: (value) => parseFloat(value),
        },
        rangeFilterFields: ['price', 'stock', 'created_at'],
      }),
    )
    params: PaginationParams,
  ) {
    return this.productService.findValidated(params);
  }
}
```

## Frontend Integration

### React/Next.js Hook

```typescript
// hooks/usePagination.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationState {
  data: any[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  links?: any;
  loading: boolean;
  error: string | null;
}

export function usePagination(apiEndpoint: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<PaginationState>({
    data: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams(searchParams.toString());
      if (!params.get('page')) params.set('page', '1');
      if (!params.get('pageSize')) params.set('pageSize', '10');

      const response = await fetch(`${apiEndpoint}?${params.toString()}`);
      const result = await response.json();

      setState((prev) => ({
        ...prev,
        data: result.list || [],
        meta: result.meta || prev.meta,
        links: result.links,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  }, [apiEndpoint, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback(
    (newParams: Record<string, any>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams],
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      updateParams({ page: 1, pageSize });
    },
    [updateParams],
  );

  const setFilters = useCallback(
    (filters: Record<string, any>) => {
      updateParams({ page: 1, ...filters });
    },
    [updateParams],
  );

  const setSorting = useCallback(
    (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
      updateParams({ sortBy, sortOrder });
    },
    [updateParams],
  );

  return {
    ...state,
    setPage,
    setPageSize,
    setFilters,
    setSorting,
    refetch: fetchData,
  };
}
```

### React Component Example

```tsx
// components/ProductTable.tsx
import React from 'react';
import { usePagination } from '../hooks/usePagination';

export function ProductTable() {
  const {
    data,
    meta,
    loading,
    error,
    setPage,
    setPageSize,
    setFilters,
    setSorting,
  } = usePagination('/api/products');

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ category });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => setSorting('name', 'ASC')}
            >
              Name
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => setSorting('price', 'DESC')}
            >
              Price
            </th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Showing {meta.itemCount} of {meta.totalItems} items
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(meta.currentPage - 1)}
            disabled={!meta.hasPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1">
            Page {meta.currentPage} of {meta.totalPages}
          </span>

          <button
            onClick={() => setPage(meta.currentPage + 1)}
            disabled={!meta.hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <select
          value={meta.itemsPerPage}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>
    </div>
  );
}
```

## Complete CRUD Example

### User Management System

```typescript
// user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'moderator'] })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ default: 0 })
  deleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(params: PaginationParams): Promise<[User[], number]> {
    const {
      skip,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      filters,
    } = params;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.deleted = 0');

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply filters
    if (filters) {
      if (filters.role) {
        queryBuilder.andWhere('user.role = :role', { role: filters.role });
      }
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', {
          isActive: filters.isActive,
        });
      }
      if (filters.dateRange) {
        queryBuilder.andWhere(
          'user.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: filters.dateRange.start,
            endDate: filters.dateRange.end,
          },
        );
      }
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Get total count
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const users = await queryBuilder.skip(skip).take(limit).getMany();

    return [users, totalCount];
  }

  async getStats() {
    const [activeUsers, totalUsers, newUsersThisMonth] = await Promise.all([
      this.userRepository.count({ where: { isActive: true, deleted: 0 } }),
      this.userRepository.count({ where: { deleted: 0 } }),
      this.userRepository.count({
        where: {
          deleted: 0,
          createdAt: MoreThan(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          ),
        },
      }),
    ]);

    return { activeUsers, totalUsers, newUsersThisMonth };
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.update(id, { deleted: 1 });
  }
}

// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AccessRoles(['admin'])
  @AutoPaginate({
    resource: 'users',
    route: '/users',
    totalItemsKey: 'total',
    options: {
      transform: (user) => ({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      }),
      addExtraMetaInfo: {
        activeUsers: 0,
        newUsersThisMonth: 0,
      },
    },
  })
  async findAll(@Pagination() params: PaginationParams) {
    const [users, total] = await this.userService.findAll(params);
    const stats = await this.userService.getStats();

    return {
      items: users,
      total: total,
      activeUsers: stats.activeUsers,
      newUsersThisMonth: stats.newUsersThisMonth,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AccessRoles(['admin'])
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AccessRoles(['admin'])
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AccessRoles(['admin'])
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
```

## Best Practices

### 1. Performance Optimization

```typescript
// Use indexes for commonly filtered/sorted fields
@Entity('products')
@Index(['category', 'deleted'])
@Index(['price'])
@Index(['created_at'])
export class Product {
  // ... entity definition
}

// Service with optimized queries
@Injectable()
export class ProductService {
  async findAllOptimized(
    params: PaginationParams,
  ): Promise<[Product[], number]> {
    // Use separate queries for count and data to optimize performance
    const baseQuery = this.productRepository
      .createQueryBuilder('product')
      .where('product.deleted = 0');

    // Apply filters to base query
    this.applyFilters(baseQuery, params);

    // Get count first (without joins if possible)
    const totalCount = await baseQuery.getCount();

    // Then get data with all joins and transformations
    const dataQuery = baseQuery.clone();
    this.applySorting(dataQuery, params);
    this.applyPagination(dataQuery, params);

    const products = await dataQuery.getMany();

    return [products, totalCount];
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    params: PaginationParams,
  ) {
    // Extract filter logic for reusability
    // ... filter implementation
  }
}
```

### 2. Caching Strategy

```typescript
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAllCached(params: PaginationParams): Promise<[Product[], number]> {
    // Create cache key from parameters
    const cacheKey = this.createCacheKey(params);

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as [Product[], number];
    }

    // Get from database
    const result = await this.findAll(params);

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }

  private createCacheKey(params: PaginationParams): string {
    return `products:${JSON.stringify(params)}`;
  }
}
```

### 3. Error Handling

```typescript
@Controller('products')
export class ProductController {
  @Get()
  async findAll(@Pagination() params: PaginationParams) {
    try {
      const [products, total] = await this.productService.findAll(params);

      return {
        success: true,
        items: products,
        total: total,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
```

### 4. API Documentation

```typescript
@Controller('products')
@ApiTags('Products')
export class ProductController {
  @Get()
  @ApiOperation({
    summary: 'Get products with pagination',
    description:
      'Retrieve a paginated list of products with optional filtering and sorting',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'name',
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'ASC',
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'laptop',
    description: 'Search term',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    example: 'electronics',
    description: 'Filter by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products',
    schema: {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' },
        },
        meta: { $ref: '#/components/schemas/PaginationMeta' },
        links: { $ref: '#/components/schemas/PaginationLinks' },
      },
    },
  })
  async findAll(@Pagination() params: PaginationParams) {
    // ... implementation
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot read property 'page' of undefined"

**Problem**: Pagination decorator not working
**Solution**:

```typescript
// Make sure to register the pagination module
@Module({
  imports: [
    PaginationModule.register({
      global: true,
      enableInterceptor: true,
    }),
  ],
})
export class AppModule {}
```

#### 2. "pageSize parameter not recognized"

**Problem**: Frontend sending 'pageSize' but backend expecting 'limit'
**Solution**:

```typescript
// Update pagination defaults
export const DEFAULT_PAGINATION_OPTIONS = {
  // ...
  limitParam: 'pageSize', // Changed from 'limit'
  reservedParams: ['page', 'pageSize', 'limit', 'sortBy', 'sortOrder'],
};
```

#### 3. "Total count is wrong with filters"

**Problem**: Count query doesn't include filters
**Solution**:

```typescript
// Get count AFTER applying filters but BEFORE pagination
const queryBuilder = this.repository.createQueryBuilder('entity');

// Apply filters first
this.applyFilters(queryBuilder, params);

// Get count with filters applied
const totalCount = await queryBuilder.getCount();

// Then apply pagination
const results = await queryBuilder.skip(skip).take(limit).getMany();
```

#### 4. "Performance issues with large datasets"

**Problem**: Slow queries on large tables
**Solutions**:

- Add database indexes on filtered/sorted columns
- Use cursor-based pagination for very large datasets
- Implement caching
- Consider using raw SQL for complex queries

#### 5. "AutoPaginate decorator not working"

**Problem**: Response not being transformed
**Solution**:

```typescript
// Ensure interceptor is enabled and return correct format
return {
  items: data, // Must be 'items'
  total: count, // Must be 'total'
};
```

### Example URLs and Expected Responses

#### Basic Pagination

```
GET /products?page=1&pageSize=10

Response:
{
  "list": [...],
  "meta": {
    "totalItems": 150,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 15,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "links": {
    "current": "/products?page=1&pageSize=10",
    "next": "/products?page=2&pageSize=10",
    "last": "/products?page=15&pageSize=10"
  }
}
```

#### With Filters and Sorting

```
GET /products?page=2&pageSize=20&sortBy=price&sortOrder=DESC&category=electronics&search=laptop

Response includes all filters preserved in links:
{
  "list": [...],
  "meta": {...},
  "links": {
    "current": "/products?page=2&pageSize=20&sortBy=price&sortOrder=DESC&category=electronics&search=laptop",
    "next": "/products?page=3&pageSize=20&sortBy=price&sortOrder=DESC&category=electronics&search=laptop",
    ...
  }
}
```

This comprehensive guide should help you implement pagination in any NestJS application with full frontend integration support.
