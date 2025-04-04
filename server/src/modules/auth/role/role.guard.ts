import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserAndRequest } from 'types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  matchPermissions(permissions: string[], userPermissions: string[]) {
    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  canActivate(context: ExecutionContext): boolean {
    const { roles, permission } = this.reflector.get<{
      roles: string[];
      permission: string[];
    }>('rolesAndPermission', context.getHandler());

    const request = context.switchToHttp().getRequest() as UserAndRequest;
    const user = request.user;

    if (user.isSuperAdmin === 1) return true;

    if (!user.role) throw new ForbiddenException('Permission Denied');

    const hasRole = this.matchRoles(roles, user.role.name);
    if (!hasRole) throw new ForbiddenException('Permission Denied');

    const hasPermission = this.matchPermissions(
      permission,
      user.role.permissions.map((permission) => permission.name),
    );

    if (!hasPermission) throw new ForbiddenException('Permission Denied');

    return true;
  }
}
