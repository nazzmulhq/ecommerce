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
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AccessRoles } from 'auth/role/role.decorator';
import { RoleGuard } from 'auth/role/role.guard';
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
    permission: ['permission.create'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(
    @Req() req: UserAndRequest,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    try {
      await this.permissionService.create(createPermissionDto);
      return {
        success: true,
        message: 'Permission Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['permission.get-all'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    try {
      const data = await this.permissionService.findAll();
      return {
        success: true,
        data,
        message: 'Permissions Fetched Successfully',
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
    permission: ['permission.get-one'],
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
    permission: ['permission.edit'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Req() req: UserAndRequest,
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    try {
      updatePermissionDto.updateBy = req.user.id || 0;
      await this.permissionService.update(+id, updatePermissionDto);
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
    permission: ['permission.delete'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id') id: number) {
    try {
      await this.permissionService.remove(+id);
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
