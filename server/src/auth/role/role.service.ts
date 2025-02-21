import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'auth/permission/entities/permission.entity';

import { User } from 'auth/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable() // 👈
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(createRoleDto.permissions),
      },
    });
    const role = new Role();
    role.name = createRoleDto.name;
    role.permissions = permissions;

    return this.roleRepository.save(role);
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    return this.roleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    const permissions = await this.permissionRepository.find({
      where: {
        id: In(updateRoleDto.permissions),
      },
    });

    role.name = updateRoleDto.name;
    role.permissions = permissions;

    return this.roleRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return this.userRepository.remove(role);
  }
}
