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
        createPermissionDto.created_by = id;
        createPermissionDto.created_at = new Date();

        const permission =
            this.permissionRepository.create(createPermissionDto);
        return this.permissionRepository.save(permission);
    }

    async findAll(params: PaginationParams) {
        const {
            skip,
            limit,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            name,
            slug,
            filters,
        } = params;

        const queryBuilder =
            this.permissionRepository.createQueryBuilder('permission');

        queryBuilder.where('permission.deleted = 0');

        // Apply filters from params.filters
        if (filters) {
            if (filters.name) {
                queryBuilder.andWhere('permission.name LIKE :name', {
                    name: `%${filters.name}%`,
                });
            }
            if (filters.slug) {
                queryBuilder.andWhere('permission.slug LIKE :slug', {
                    slug: `%${filters.slug}%`,
                });
            }
        }

        // Apply direct filter parameters (backward compatibility)
        if (name) {
            queryBuilder.andWhere('permission.name LIKE :name', {
                name: `%${name}%`,
            });
        }
        if (slug) {
            queryBuilder.andWhere('permission.slug LIKE :slug', {
                slug: `%${slug}%`,
            });
        }

        // Get total count BEFORE applying pagination
        const totalCount = await queryBuilder.getCount();

        // Apply sorting based on provided parameters
        if (sortBy && typeof sortBy !== 'symbol' && sortOrder) {
            queryBuilder.orderBy(`permission.${sortBy}`, sortOrder);
        } else {
            // Default sort by created_at DESC if no valid sortBy provided
            queryBuilder.orderBy('permission.created_at', 'DESC');
        }

        // Apply pagination
        queryBuilder.skip(skip).take(limit);

        const permissions = await queryBuilder.getMany();
        return [permissions, totalCount];
    }

    async findOne(id: number): Promise<Permission> {
        return await this.permissionRepository.findOne({
            where: {
                id,
                deleted: 0,
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
                deleted: 0,
            },
        });
        if (!existingPermission) {
            throw new Error('Permission not found');
        }

        // Use update method directly instead of merge + save
        await this.permissionRepository.update(id, {
            ...updateData,
            updated_by: userId,
            updated_at: new Date(),
        });

        // Return the updated record
        return await this.permissionRepository.findOne({
            where: { id },
        });
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

        // Use update method directly instead of merge + update
        await this.permissionRepository.update(id, {
            deleted: 1,
            deleted_at: new Date(),
            deleted_by: userId,
        });
    }
}
