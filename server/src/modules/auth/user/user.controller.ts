import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { AccessRoles } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';
import { CreateUserDto } from './dto';
import { UsersService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['superadmin'],
    permission: [],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['superadmin'],
    permission: [],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['superadmin'],
    permission: [],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['superadmin'],
    permission: [],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @AccessRoles({
    roles: ['superadmin'],
    permission: [],
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
