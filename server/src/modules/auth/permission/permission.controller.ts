import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { AccessRoles } from 'modules/auth/role/role.decorator';
import { RoleGuard } from 'modules/auth/role/role.guard';
import { AutoPaginate } from 'modules/pagination/decorators/auto-paginate.decorator';
import { Pagination } from 'modules/pagination/decorators/pagination.decorator';
import { PaginationParams } from 'modules/pagination/interfaces/pagination-params.interface';
import { UserAndRequest } from 'types';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async create(
        @Req() req: UserAndRequest,
        @Body() createPermissionDto: CreatePermissionDto,
    ) {
        try {
            const data = await this.permissionService.create(
                createPermissionDto,
                req.user.id,
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    @Get()
    @AutoPaginate({
        resource: 'permission',
        route: 'permissions',
        totalItemsKey: 'total', // Specify the key that contains total count
    })
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async findAll(@Pagination() params: PaginationParams) {
        try {
            const [permissions, total] =
                await this.permissionService.findAll(params);

            // Return in format that interceptor can handle
            return {
                items: permissions,
                total: total,
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
    @Get(':id')
    async findOne(@Param('id') id: number) {
        try {
            const data = await this.permissionService.findOne(+id);
            return {
                success: true,
                data,
                message: 'Permission Fetched Successfully',
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message,
            };
        }
    }

    @Put(':id')
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async update(
        @Req() req: UserAndRequest,
        @Param('id') id: number,
        @Body() updatePermissionDto: UpdatePermissionDto,
    ) {
        try {
            updatePermissionDto.updateBy = req.user.id || 0;
            await this.permissionService.update(
                +id,
                updatePermissionDto,
                req.user.id,
            );
            return {
                success: true,
                message: 'Permission Updated Successfully',
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.message,
            };
        }
    }

    @Delete(':id')
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async remove(@Param('id') id: number, @Req() req: UserAndRequest) {
        try {
            await this.permissionService.remove(+id, req.user.id);
            return {
                success: true,
                message: 'Permission Deleted Successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
