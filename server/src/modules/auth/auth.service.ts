import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RouteService } from 'modules/routes/routes.service';
import { CreateUserDto } from 'modules/user/dto';
import { UsersService } from 'modules/user/user.service';
import { ExtendedCache, UserAndRequest } from 'types';
import { User } from '../user/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: ExtendedCache,
        private usersService: UsersService,
        private jwtService: JwtService,
        private routeService: RouteService,
    ) {}

    async signup(authRegisterDto: CreateUserDto) {
        try {
            const cachedUser =
                await this.cacheService.get<UserAndRequest['user']>('user');
            if (cachedUser) await this.cacheService.del('user');
            const user = await this.usersService.findByEmail(
                authRegisterDto.email,
            );
            if (user) {
                throw new UnauthorizedException('User already exists');
            }
            return await this.usersService.create(authRegisterDto);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(authLoginDto: AuthLoginDto) {
        const cachedUser =
            await this.cacheService.get<UserAndRequest['user']>('user');
        if (cachedUser) await this.cacheService.del('user');
        const user = await this.validateUser(authLoginDto);

        const permissions = user.roles
            .map((role) => {
                return role.permissions.map((permission) => permission);
            })
            .flat();

        const uniquePermissions = permissions.filter(
            (permission, index, self) =>
                index === self.findIndex((t) => t.id === permission.id),
        );

        const permissionsIds = [
            ...new Set(uniquePermissions.map((permission) => permission.id)),
        ];

        const routes =
            await this.routeService.findRoutesByPermissionIds(permissionsIds);

        const payload = {
            email: user.email,
        };

        delete user.password;
        delete user.isSuperAdmin;
        delete user.status;

        return {
            token: this.jwtService.sign(payload),
            permissions: uniquePermissions,
            routes,
            user,
        };
    }

    async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
        const { email, password } = authLoginDto;

        const user = await this.usersService.findByEmail(email);
        if (!(await user?.validatePassword(password))) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
