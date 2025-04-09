import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUserDto } from 'modules/auth/user/dto';
import { UsersService } from 'modules/auth/user/user.service';
import { ExtendedCache, UserAndRequest } from 'types';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from './user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: ExtendedCache,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(authRegisterDto: CreateUserDto) {
    try {
      const cachedUser =
        await this.cacheService.get<UserAndRequest['user']>('user');
      if (cachedUser) await this.cacheService.del('user');
      const user = await this.usersService.findByEmail(authRegisterDto.email);
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

    const payload = {
      email: user.email,
    };

    return this.jwtService.sign(payload);
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
