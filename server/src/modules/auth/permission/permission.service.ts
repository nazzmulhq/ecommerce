import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'modules/pagination/interfaces/pagination-params.interface';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async create(
        createPermissionDto: CreatePermissionDto,
        id: number,
    ): Promise<Permission> {
        const existingPermission = await this.permissionRepository.findOne({
            where: {
                name: createPermissionDto.name,
                deleted: 0,
            },
        });
        if (existingPermission) {
            throw new Error('Permission already exists');
        }
        createPermissionDto.createBy = id;
        createPermissionDto.createdAt = new Date();

        const permission =
            this.permissionRepository.create(createPermissionDto);
        return this.permissionRepository.save(permission);
    }

    async findAll(params: PaginationParams) {
        const { skip, limit, sortBy = 'name', sortOrder = 'ASC' } = params;
        const queryBuilder =
            this.permissionRepository.createQueryBuilder('permission');

        queryBuilder.where('permission.deleted = 0').skip(skip).take(limit);

        if (typeof sortBy !== 'symbol' && sortOrder) {
            queryBuilder.orderBy(`permission.${sortBy}`, sortOrder);
        }
        const [permission, total] = await queryBuilder.getManyAndCount();
        return [permission, total];
    }

    async findOne(id: number): Promise<Permission> {
        return await this.permissionRepository.findOne({
            where: {
                id,
                status: 1,
            },
        });
    }

    async update(
        id: number,
        updateData: Partial<Permission>,
        userId: number,
    ): Promise<Permission> {
        const existingPermission = await this.permissionRepository.findOne({
            where: {
                id,
                status: 1,
            },
        });
        if (!existingPermission) {
            throw new Error('Permission not found');
        }

        updateData.updated_by = userId;

        const permission = this.permissionRepository.merge(
            existingPermission,
            updateData,
        );
        return this.permissionRepository.save(permission);
    }

    async remove(id: number, userId: number): Promise<void> {
        const existingPermission = await this.permissionRepository.findOne({
            where: {
                id,
            },
        });
        if (!existingPermission) {
            throw new Error('Permission not found');
        }
        const updateData = {
            status: 0,
            updatedAt: new Date(),
            updateBy: userId,
        };

        const permission = this.permissionRepository.merge(
            existingPermission,
            updateData,
        );

        this.permissionRepository.save(permission);
    }
}
