import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'modules/auth/permission/entities/permission.entity';
import { In, Repository } from 'typeorm';
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
        route.metadata = createRouteDto.metadata;

        // Allow multiple roots by making parent_id optional
        if (createRouteDto.parent_id) {
            const parent = await this.routeRepository.findOne({
                where: { id: createRouteDto.parent_id },
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
            const parent = await this.routeRepository.findOne({
                where: { id: updateRouteDto.parent_id },
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

    async findAllRoutesWithPermissions(user: IUser): Promise<Route[]> {
        if (user) {
            // if user is logged in, get all routes with permissions
            const permissions = user.roles
                .flatMap((role) => role.permissions)
                .map((permission) => permission.id);
            const routes = await this.routeRepository
                .createQueryBuilder('route')
                .leftJoinAndSelect('route.permissions', 'permission')
                .leftJoinAndSelect('route.children', 'children')
                .where('permission.id IN (:...permissions)', { permissions })
                .orWhere('route.type IN (:...types)', {
                    types: ['guest', 'shared', 'devOnly'],
                })
                .orderBy('route.position', 'ASC')
                .addOrderBy('children.position', 'ASC')
                .getMany();

            return routes.map((route) => {
                delete route.metadata;
                return route;
            });
        } else {
            // only type guest shared and devOnly
            const routes = await this.routeRepository
                .createQueryBuilder('route')
                .leftJoinAndSelect('route.parent', 'parent')
                .leftJoinAndSelect('route.children', 'children')
                .where('route.type IN (:...types)', {
                    types: ['guest', 'shared', 'devOnly'],
                })
                .orderBy('route.position', 'ASC')
                .addOrderBy('children.position', 'ASC')
                .getMany();

            return routes.map((route) => {
                delete route.metadata;
                return route;
            });
        }
    }
}
