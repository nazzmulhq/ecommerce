import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'modules/auth/permission/entities/permission.entity';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { ExtendedCache, IUser } from 'types';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: ExtendedCache, // CacheService
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async create(
        createRouteDto: CreateRouteDto,
        userId: number,
    ): Promise<Route> {
        const route = new Route();
        route.name = createRouteDto.name;
        route.path = createRouteDto.path;
        route.message_id = createRouteDto.message_id;
        route.type = createRouteDto.type;
        route.icon = createRouteDto.icon;
        route.position = createRouteDto.position;
        route.metadata = createRouteDto.metadata;

        // Allow multiple roots by making parent_id optional
        if (createRouteDto.parent_id) {
            // Ensure parent_id is properly converted to number
            const parentId =
                typeof createRouteDto.parent_id === 'string'
                    ? parseInt(createRouteDto.parent_id, 10)
                    : createRouteDto.parent_id;

            if (isNaN(parentId)) {
                throw new Error('Invalid parent_id format');
            }

            const parent = await this.routeRepository.findOne({
                where: { id: parentId },
            });
            if (parent) {
                route.parent = parent;
            } else {
                throw new Error('Parent route not found');
            }
        }
        // If no parent_id is provided, this will be a root node

        route.permissions = await this.permissionRepository.find({
            where: {
                id: In(createRouteDto.permissions),
            },
        });

        route.created_by = userId;

        return this.routeRepository.save(route);
    }

    async findAll() {
        await this.cacheService.del('/route');
        return this.routeRepository.find({
            relations: ['permissions', 'parent', 'children'],
        });
    }

    findOne(id: string) {
        return this.routeRepository.findOne({
            where: { id: +id },
            relations: ['permissions', 'parent', 'children'],
        });
    }

    async update(id: string, updateRouteDto: UpdateRouteDto, userId: number) {
        const route = await this.routeRepository.findOne({
            where: { id: +id },
            relations: ['permissions'],
        });
        route.name = updateRouteDto.name;

        route.permissions = await this.permissionRepository.find({
            where: {
                id: In(updateRouteDto.permissions),
            },
        });

        if (updateRouteDto.parent_id) {
            // Ensure parent_id is properly converted to number
            const parentId =
                typeof updateRouteDto.parent_id === 'string'
                    ? parseInt(updateRouteDto.parent_id, 10)
                    : updateRouteDto.parent_id;

            if (isNaN(parentId)) {
                throw new Error('Invalid parent_id format');
            }

            const parent = await this.routeRepository.findOne({
                where: { id: parentId },
            });
            if (parent) {
                route.parent = parent;
            }
        }

        route.updated_by = userId;
        route.path = updateRouteDto.path;
        route.type = updateRouteDto.type;
        route.metadata = updateRouteDto.metadata;
        return this.routeRepository.save(route);
    }

    async remove(id: string, userId: number): Promise<number> {
        const route = await this.routeRepository.findOne({
            where: { id: +id },
            relations: ['permissions', 'children'],
        });

        if (!route) {
            throw new Error('Route not found');
        }

        // Remove all child routes recursively
        if (route.children && route.children.length > 0) {
            for (const child of route.children) {
                await this.remove(child.id.toString(), userId);
            }
        }

        // Remove many-to-many relations
        route.permissions = [];
        await this.routeRepository.save(route);

        // Delete the route
        await this.routeRepository.delete(id);

        return +id;
    }

    async findRoutesByPermissionIds(permissionIds: number[]): Promise<Route[]> {
        if (!permissionIds || permissionIds.length === 0) {
            return []; // Return an empty array if no permission IDs are provided
        }

        const routes = await this.routeRepository
            .createQueryBuilder('route')
            .leftJoinAndSelect('route.permissions', 'permission')
            .where('permission.id IN (:...permissionIds)', { permissionIds })
            .getMany();

        return routes;
    }

    async findAllRoutesWithPermissions(
        user: IUser,
        type: 'plain' | 'nested' = 'nested',
        maxDepth: number = 10, // Default maximum nesting depth, can be adjusted
    ): Promise<Route[]> {
        // Common constants
        const publicTypes = ['guest', 'shared', 'devOnly'];

        // Get user permissions if available
        const permissionIds =
            user?.roles
                ?.flatMap((role) => role.permissions)
                .map((permission) => permission.id) || [];

        if (type === 'nested') {
            // Use recursive CTE (Common Table Expression) approach for n-level nesting
            const baseQuery = this.routeRepository
                .createQueryBuilder('route')
                .where('route.deleted = 0')
                .andWhere('route.parentId IS NULL') // Only get top-level routes
                .orderBy('route.position', 'ASC');

            // Apply permission filtering for the root level
            this.applyPermissionFilters(
                baseQuery,
                user,
                permissionIds,
                publicTypes,
            );

            // Get the root routes
            const rootRoutes = await baseQuery.getMany();

            // Recursively load children for each route up to maxDepth
            for (const route of rootRoutes) {
                await this.loadChildrenRecursively(
                    route,
                    user,
                    permissionIds,
                    publicTypes,
                    1,
                    maxDepth,
                );
            }

            return rootRoutes;
        } else {
            // Plain list of routes - includes all routes with their metadata
            // but doesn't create a nested structure
            const baseQuery = this.routeRepository
                .createQueryBuilder('route')
                .select([
                    'route.id',
                    'route.name',
                    'route.slug',
                    'route.message_id',
                    'route.type',
                    'route.path',
                    'route.icon',
                    'route.position',
                    'route.is_menu',
                    'route.is_sub_menu',
                    'route.is_dynamic_route',
                    'route.metadata',
                    'route.parentId',
                ])
                .andWhere('route.deleted = 0')
                .andWhere('route.parentId IS NOT NULL') // Exclude root routes
                .orderBy('route.position', 'ASC');

            // Apply permission filtering for plain list
            if (user) {
                if (permissionIds.length > 0) {
                    baseQuery
                        .leftJoin('route.permissions', 'routePermission')
                        .andWhere(
                            'routePermission.id IN (:...permissionIds) OR route.type IN (:...publicTypes)',
                            { permissionIds, publicTypes },
                        );
                } else {
                    // User without permissions - only return public routes
                    baseQuery.andWhere('route.type IN (:...types)', {
                        types: publicTypes,
                    });
                }
            } else {
                // Unauthenticated user - only return public routes
                baseQuery.andWhere('route.type IN (:...types)', {
                    types: publicTypes,
                });
            }

            return baseQuery.getMany();
        }
    }

    /**
     * Recursively load children for a route up to a maximum depth
     */
    private async loadChildrenRecursively(
        parentRoute: Route,
        user: IUser | null,
        permissionIds: number[],
        publicTypes: string[],
        currentDepth: number,
        maxDepth: number,
    ): Promise<void> {
        // Stop recursion if we've reached maximum depth
        if (currentDepth >= maxDepth) {
            return;
        }

        // Query for children of this route
        const childrenQuery = this.routeRepository
            .createQueryBuilder('child')
            .where('child.deleted = 0')
            .andWhere('child.parentId = :parentId', {
                parentId: parentRoute.id,
            })
            .orderBy('child.position', 'ASC');

        // Apply permission filtering for child routes
        this.applyPermissionFilterToSingleLevel(
            childrenQuery,
            user,
            permissionIds,
            publicTypes,
        );

        // Get the children
        const children = await childrenQuery.getMany();

        // Assign the children to the parent route
        parentRoute.children = children;

        // Recursively load children for each child route
        for (const child of children) {
            await this.loadChildrenRecursively(
                child,
                user,
                permissionIds,
                publicTypes,
                currentDepth + 1,
                maxDepth,
            );
        }
    }

    /**
     * Apply permission filters to a single level query
     */
    private applyPermissionFilterToSingleLevel(
        query: SelectQueryBuilder<Route>,
        user: IUser | null,
        permissionIds: number[],
        publicTypes: string[],
    ): void {
        if (user) {
            if (permissionIds.length > 0) {
                // For authenticated users with permissions
                query
                    .leftJoin('child.permissions', 'childPermission')
                    .andWhere(
                        '(childPermission.id IN (:...permIds) OR child.type IN (:...publicTypes))',
                        { permIds: permissionIds, publicTypes },
                    );
            } else {
                // User is authenticated but has no permissions
                query.andWhere('child.type IN (:...publicTypes)', {
                    publicTypes,
                });
            }
        } else {
            // For unauthenticated users
            query.andWhere('child.type IN (:...publicTypes)', { publicTypes });
        }
    }

    // Original method is kept but simplified for single level filtering
    private applyPermissionFilters(
        baseQuery: SelectQueryBuilder<Route>,
        user: IUser | null,
        permissionIds: number[],
        publicTypes: string[],
    ): void {
        if (user) {
            if (permissionIds.length > 0) {
                // For authenticated users with permissions
                baseQuery
                    .leftJoin('route.permissions', 'routePermission')
                    .andWhere(
                        '(routePermission.id IN (:...permIds) OR route.type IN (:...publicTypes))',
                        { permIds: permissionIds, publicTypes },
                    );
            } else {
                // User without permissions - only return public routes
                baseQuery.andWhere('route.type IN (:...types)', {
                    types: publicTypes,
                });
            }
        } else {
            // Unauthenticated user - only return public routes
            baseQuery.andWhere('route.type IN (:...types)', {
                types: publicTypes,
            });
        }
    }
}
