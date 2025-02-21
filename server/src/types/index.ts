import { Cache as NestCache } from '@nestjs/cache-manager';
import { Permission } from 'auth/permission/entities/permission.entity';
import { Role } from 'auth/role/entities/role.entity';
export interface IUser {
  id: number;
  name: string;
  email: string;
  isSuperAdmin: number;
  role: Role & { permissions: Permission[] };
}

export interface UserAndRequest extends Request {
  user: IUser;
}

export interface ExtendedCache extends NestCache {
  set<T>(key: string, value: T, options?: any): Promise<void>;
}
