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
    ): Promise<Route[]> {
        // Common constants
        const publicTypes = ['guest', 'shared', 'devOnly'];

        // Get user permissions if available
        const permissionIds =
            user?.roles
                ?.flatMap((role) => role.permissions)
                .map((permission) => permission.id) || [];

        if (type === 'nested') {
            const baseQuery = this.routeRepository
                .createQueryBuilder('route')
                .leftJoinAndSelect('route.children', 'children')
                .leftJoinAndSelect('children.children', 'grandchildren')
                .andWhere('route.deleted = 0')
                .andWhere('route.parentId IS NULL') // Only get top-level routes
                .orderBy('route.position', 'ASC')
                .addOrderBy('children.position', 'ASC')
                .addOrderBy('grandchildren.position', 'ASC');

            // Filter out deleted children and grandchildren
            baseQuery.andWhere('(children.id IS NULL OR children.deleted = 0)');
            baseQuery.andWhere(
                '(grandchildren.id IS NULL OR grandchildren.deleted = 0)',
            );

            // Apply permission filtering
            this.applyPermissionFilters(
                baseQuery,
                user,
                permissionIds,
                publicTypes,
            );

            return baseQuery.getMany();
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

    // Helper method to apply permission filters for nested queries
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
                    .leftJoin('children.permissions', 'childPermission')
                    .leftJoin(
                        'grandchildren.permissions',
                        'grandchildPermission',
                    )
                    .andWhere(
                        '(routePermission.id IN (:...routePermIds) OR route.type IN (:...routeTypes))',
                        {
                            routePermIds: permissionIds,
                            routeTypes: publicTypes,
                        },
                    )
                    .andWhere(
                        '(children.id IS NULL OR childPermission.id IN (:...childPermIds) OR children.type IN (:...childTypes))',
                        {
                            childPermIds: permissionIds,
                            childTypes: publicTypes,
                        },
                    )
                    .andWhere(
                        '(grandchildren.id IS NULL OR grandchildPermission.id IN (:...grandPermIds) OR grandchildren.type IN (:...grandTypes))',
                        {
                            grandPermIds: permissionIds,
                            grandTypes: publicTypes,
                        },
                    );
            } else {
                // User is authenticated but has no permissions
                baseQuery
                    .andWhere('route.type IN (:...routeTypes)', {
                        routeTypes: publicTypes,
                    })
                    .andWhere(
                        '(children.id IS NULL OR children.type IN (:...childTypes))',
                        { childTypes: publicTypes },
                    )
                    .andWhere(
                        '(grandchildren.id IS NULL OR grandchildren.type IN (:...grandTypes))',
                        { grandTypes: publicTypes },
                    );
            }
        } else {
            // For unauthenticated users
            baseQuery
                .andWhere('route.type IN (:...routeTypes)', {
                    routeTypes: publicTypes,
                })
                .andWhere(
                    '(children.id IS NULL OR children.type IN (:...childTypes))',
                    { childTypes: publicTypes },
                )
                .andWhere(
                    '(grandchildren.id IS NULL OR grandchildren.type IN (:...grandTypes))',
                    { grandTypes: publicTypes },
                );
        }
    }
}
