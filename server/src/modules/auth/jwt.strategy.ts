import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'modules/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ExtendedCache } from 'types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: ExtendedCache,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.email) {
      throw new UnauthorizedException('Invalid token');
    }
    const userInCache = await this.cacheService.get('user');
    if (!userInCache) {
      const user = await this.usersService.showByEmail(payload.email);
      await this.cacheService.set('user', user);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return user;
    } else {
      return userInCache;
    }
  }
}
