import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAllGuard, JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { AccessRoles } from 'modules/auth/role/role.decorator';
import { RoleGuard } from 'modules/auth/role/role.guard';
import { AutoPaginate } from 'modules/pagination/decorators/auto-paginate.decorator';
import { Pagination } from 'modules/pagination/decorators/pagination.decorator';
import { PaginationParams } from 'modules/pagination/interfaces/pagination-params.interface';
import { UserAndRequest } from 'types';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteService } from './routes.service';

@ApiTags('Route')
@Controller('route')
export class RouteController {
    constructor(private readonly routeService: RouteService) {}

    @Get('all')
    @ApiBearerAuth()
    @UseGuards(AllowAllGuard)
    async findManyRouteByUserId(
        @Req() req: UserAndRequest,
        @Query('type') type: 'plain' | 'nested',
    ) {
        try {
            const user = req.user;
            return await this.routeService.findAllRoutesWithPermissions(
                user,
                type,
            );
        } catch (error) {
            console.error('Error fetching routes:', error.message);
            return {
                success: false,
                message: error.message || 'Failed to fetch routes',
            };
        }
    }

    @Post()
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async create(
        @Req() req: UserAndRequest,
        @Body() createRouteDto: CreateRouteDto,
    ) {
        try {
            const result = await this.routeService.create(
                createRouteDto,
                req.user.id,
            );
            return {
                success: true,
                data: result,
                message: 'Route Created Successfully',
            };
        } catch (error) {
            console.error('Error creating route:', error);
            return {
                success: false,
                message: error.message || 'Failed to create route',
            };
        }
    }

    @Get()
    @AutoPaginate({
        resource: 'route',
        route: 'route',
    })
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async findAll(@Pagination() params: PaginationParams) {
        const [route, _] = await this.routeService.findAll(params);
        return route;
    }

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
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
        permission: [],
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
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    remove(@Req() req: UserAndRequest, @Param('id') id: string) {
        return this.routeService.remove(id, req.user.id);
    }
}
