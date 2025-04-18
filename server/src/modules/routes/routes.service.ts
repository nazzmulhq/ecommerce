import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'modules/auth/permission/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { ExtendedCache } from 'types';
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

  async create(createRouteDto: CreateRouteDto, userId: number): Promise<Route> {
    const route = new Route();
    route.name = createRouteDto.name;
    route.path = createRouteDto.path;
    route.metadata = createRouteDto.metadata;

    if (createRouteDto.parent && createRouteDto.parent.id) {
      const parent = await this.routeRepository.findOne({
        where: { id: createRouteDto.parent.id },
      });
      if (parent) {
        route.parent = parent;
      }
    } else {
      // Ensure no other root entity exists
      const existingRoot = await this.routeRepository.findOne({
        where: { parent: null },
      });
      if (existingRoot) {
        throw new Error('Nested sets do not support multiple root entities.');
      }
    }

    route.permissions = await this.permissionRepository.find({
      where: {
        id: In(createRouteDto.permissions),
      },
    });

    route.createdAt = new Date();
    route.createBy = userId;

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
      where: { id },
      relations: ['permissions', 'parent', 'children'],
    });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto, userId: number) {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    route.name = updateRouteDto.name;

    route.permissions = await this.permissionRepository.find({
      where: {
        id: In(updateRouteDto.permissions),
      },
    });

    if (updateRouteDto.parent && updateRouteDto.parent.id) {
      const parent = await this.routeRepository.findOne({
        where: { id: updateRouteDto.parent.id },
      });
      if (parent) {
        route.parent = parent;
      }
    }

    route.updatedAt = new Date();
    route.updateBy = userId;
    route.path = updateRouteDto.path;
    route.type = updateRouteDto.type;
    route.metadata = updateRouteDto.metadata;
    return this.routeRepository.save(route);
  }

  async remove(id: string, userId: number): Promise<number> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['permissions', 'children'],
    });

    if (!route) {
      throw new Error('Route not found');
    }

    // Remove all child routes recursively
    if (route.children && route.children.length > 0) {
      for (const child of route.children) {
        await this.remove(child.id, userId);
      }
    }

    // Remove many-to-many relations
    route.permissions = [];
    await this.routeRepository.save(route);

    // Delete the route
    await this.routeRepository.delete(id);

    return +id;
  }
}
