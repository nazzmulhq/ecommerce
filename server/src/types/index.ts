import { Cache as NestCache } from '@nestjs/cache-manager';
import { Role } from 'modules/auth/role/entities/role.entity';
export interface IUser {
  id: number;
  name: string;
  email: string;
  isSuperAdmin: number;
  roles: Role[];
}

export interface UserAndRequest extends Request {
  user: IUser;
}

export interface ExtendedCache extends NestCache {
  set<T>(key: string, value: T, options?: any): Promise<T>;
}
