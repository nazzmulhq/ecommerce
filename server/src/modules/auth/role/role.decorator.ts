import { SetMetadata } from '@nestjs/common';

export const AccessRoles = (args: { roles: string[]; permission: string[] }) =>
  SetMetadata('rolesAndPermission', args);
