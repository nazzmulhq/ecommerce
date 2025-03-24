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

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = new Route();
    route.name = createRouteDto.name;
    route.path = createRouteDto.path;

    if (createRouteDto.parent && createRouteDto.parent.id) {
      const parent = await this.routeRepository.findOne({
        where: { id: createRouteDto.parent.id },
      });
      if (parent) {
        route.parent = parent;
      }
    }
    route.permissions = await this.permissionRepository.find({
      where: {
        id: In(createRouteDto.permissions),
      },
    });

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

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const Route = await this.routeRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    Route.name = updateRouteDto.name;
    if (updateRouteDto.parent.id) {
      const parent = await this.routeRepository.findOne({
        where: { id: updateRouteDto.parent.id },
      });
      if (parent) {
        Route.parent = parent;
      }
    }
    Route.permissions = await this.permissionRepository.find({
      where: {
        id: In(updateRouteDto.permissions),
      },
    });
    return this.routeRepository.save(Route);
  }

  remove(id: string) {
    return this.routeRepository.delete(id);
  }
}
