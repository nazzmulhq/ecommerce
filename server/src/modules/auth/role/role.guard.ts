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

  matchRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
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

    if (!user.roles || user.roles.length === 0)
      throw new ForbiddenException('Permission Denied');

    const userRoles = user.roles.map((role) => role.name);
    const hasRole = this.matchRoles(roles, userRoles);
    if (!hasRole) throw new ForbiddenException('Permission Denied');

    const userPermissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    );
    const hasPermission = this.matchPermissions(permission, userPermissions);

    if (!hasPermission) throw new ForbiddenException('Permission Denied');

    return true;
  }
}
