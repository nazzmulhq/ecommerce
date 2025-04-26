import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
    CACHE_MANAGER,
    CacheInterceptor,
    CacheKey,
    CacheTTL,
} from '@nestjs/cache-manager';
import { CreateUserDto } from 'modules/user/dto';
import { ExtendedCache, UserAndRequest } from 'types';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AccessRoles } from './role/role.decorator';
import { RoleGuard } from './role/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER) private cacheService: ExtendedCache,
    ) {}

    @Post('signup')
    async signup(@Body() authLoginDto: CreateUserDto) {
        return this.authService.signup(authLoginDto);
    }

    @Post('login')
    async login(@Body() authLoginDto: AuthLoginDto) {
        // Clear the cache
        await this.cacheService.del('custom-key');
        return this.authService.login(authLoginDto);
    }

    @Get('user-info')
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin', 'user'],
        permission: ['user.get-profile'],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getRoutesAndPermissionsByUserId(@Req() req: UserAndRequest) {
        console.log('req.users', req.user);

        return this.authService.getRoutesAndPermissionsByUserId(req.user);
    }

    @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
    @CacheKey('custom-key') // autogenerates the key based on the route path. override this if you want to set a custom key
    @CacheTTL(30) // override TTL to 30 seconds
    @Get('profile')
    @ApiBearerAuth()
    @AccessRoles({
        roles: ['admin', 'user'],
        permission: ['user.get-profile'],
    })
    @UseGuards(JwtAuthGuard, RoleGuard)
    async test(@Req() req: UserAndRequest) {
        console.log('req.users', req.user);

        return req.user;
    }
}
