import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'modules/auth/permission/entities/permission.entity';

import { User } from 'modules/user/entities/user.entity';
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

    async create(createRoleDto: CreateRoleDto, userId: number): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({
            where: {
                name: createRoleDto.name,
            },
        });

        if (existingRole) {
            throw new Error('Role already exists');
        }

        const permissions = await this.permissionRepository.find({
            where: {
                id: In(createRoleDto.permissions),
            },
        });

        const role = new Role();
        role.name = createRoleDto.name;
        role.permissions = permissions;
        role.createBy = userId;
        role.createdAt = new Date();

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

    async findByName(name: string) {
        return this.roleRepository.findOne({
            where: {
                name,
            },
        });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto, userId: number) {
        const role = await this.roleRepository.findOne({
            where: {
                id,
            },
        });

        if (!role) {
            throw new Error('Role not found');
        }

        const permissions = await this.permissionRepository.find({
            where: {
                id: In(updateRoleDto.permissions),
            },
        });

        role.name = updateRoleDto.name;
        role.permissions = permissions;
        role.updateBy = userId;
        role.updatedAt = new Date();

        return this.roleRepository.save(role);
    }

    async remove(id: number, userId: number) {
        const existingRole = await this.roleRepository.findOne({
            where: {
                id,
            },
        });
        if (!existingRole) {
            throw new Error('Role not found');
        }
        const updateData = {
            status: 0,
            updatedAt: new Date(),
            updateBy: userId,
        };

        return await this.roleRepository.update(id, updateData);
    }
}
