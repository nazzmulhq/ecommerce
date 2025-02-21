import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'auth/permission/entities/permission.entity';

import { User } from 'auth/user/entities/user.entity';
import { Route } from './entities/route.entity';

import { RouteController } from './routes.controller';
import { RouteService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, User, Permission])],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
