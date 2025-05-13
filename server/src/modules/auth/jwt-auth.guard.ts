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

/**
 * Guard that allows both authenticated and unauthenticated requests.
 * If the user is authenticated, returns the user object.
 * If the user is not authenticated, returns null.
 */
@Injectable()
export class AllowAllGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // Return user if authenticated, null if not
        // Don't throw errors for missing/invalid tokens
        return user || null;
    }
}
