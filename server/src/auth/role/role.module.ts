import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'auth/permission/entities/permission.entity';

import { User } from 'auth/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleGuard } from './role.guard';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Permission])],
  controllers: [RoleController],
  providers: [RoleService, RoleGuard],
  exports: [RoleService, RoleGuard],
})
export class RoleModule {}
