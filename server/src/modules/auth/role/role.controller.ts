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
import { UserAndRequest } from 'types';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AccessRoles } from './role.decorator';
import { RoleGuard } from './role.guard';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['role.create'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async create(
    @Req() req: UserAndRequest,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    try {
      const existingRole = await this.roleService.findByName(
        createRoleDto.name,
      );
      if (existingRole) {
        return {
          success: false,
          message: 'Role already exists',
        };
      }
      await this.roleService.create(createRoleDto, req.user.id);
      return {
        success: true,
        message: 'Role Created Successfully',
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
    permission: ['role.find-all'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    try {
      const data = await this.roleService.findAll();
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
    permission: ['role.find-one'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.roleService.findOne(+id);
      return {
        success: true,
        data,
        message: 'Role Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['role.edit'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: UserAndRequest,
  ) {
    try {
      const existingRole = await this.roleService.findByName(
        updateRoleDto.name,
      );
      if (existingRole && existingRole.id !== +id) {
        return {
          success: false,
          message: 'Role already exists',
        };
      }
      await this.roleService.update(+id, updateRoleDto, req.user.id);
      return {
        success: true,
        message: 'Role Updated Successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['admin'],
    permission: ['role.delete'],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: UserAndRequest) {
    try {
      const existingRole = await this.roleService.findOne(+id);
      if (!existingRole) {
        return {
          success: false,
          message: 'Role not found',
        };
      }
      await this.roleService.remove(+id, req.user.id);
      return {
        success: true,
        message: 'Role Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
