import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        if (err || !user) {
            throw (
                err ||
                new UnauthorizedException(info?.message || 'Unauthorized')
            );
        }

        return user;
    }
}

// if user is login then return user user
@Injectable()
export class AlowAllGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        if (err || !user) {
            return null;
        }

        return user;
    }
}
