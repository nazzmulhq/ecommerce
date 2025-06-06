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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccessRoles } from '../auth/role/role.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { CreateUserDto } from './dto';
import { UsersService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    show(@Param('id') id: string) {
        return this.usersService.showById(+id);
    }

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin'],
        permission: [],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
