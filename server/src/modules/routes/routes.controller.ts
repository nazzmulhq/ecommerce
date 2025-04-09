import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { AccessRoles } from 'modules/auth/role/role.decorator';
import { RoleGuard } from 'modules/auth/role/role.guard';
import { UserAndRequest } from 'types';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteService } from './routes.service';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['route.create'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(
    @Req() req: UserAndRequest,
    @Body() createRoleDto: CreateRouteDto,
  ) {
    try {
      await this.routeService.create(createRoleDto, req.user.id);
      return {
        success: true,
        message: 'Route Created Successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
  // @CacheKey('custom-key') // custom key
  // @CacheTTL(30) // 30 seconds
  @Get()
  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['route.get-all'],
  })
  // @UseInterceptors(CacheInterceptor)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    try {
      const route = await this.routeService.findAll();
      return {
        success: true,
        data: route,
        message: 'Route Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['route.get-one'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const route = await this.routeService.findOne(id);
      return {
        success: true,
        data: route,
        message: 'Route Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['route.update'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Req() req: UserAndRequest,
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    return this.routeService.update(id, updateRouteDto, req.user.id);
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['route.delete'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Req() req: UserAndRequest, @Param('id') id: string) {
    return this.routeService.remove(id, req.user.id);
  }
}
