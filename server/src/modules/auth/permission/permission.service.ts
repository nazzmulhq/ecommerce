import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly userRepository: Repository<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    id: number,
  ): Promise<Permission> {
    const existingPermission = await this.userRepository.findOne({
      where: {
        name: createPermissionDto.name,
        status: 1,
      },
    });
    if (existingPermission) {
      throw new Error('Permission already exists');
    }
    createPermissionDto.createBy = id;
    createPermissionDto.createdAt = new Date();
    const permission = this.userRepository.create(createPermissionDto);
    return this.userRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.userRepository.find({
      where: {
        status: 1,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Permission> {
    return await this.userRepository.findOne({
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
    const existingPermission = await this.userRepository.findOne({
      where: {
        id,
        status: 1,
      },
    });
    if (!existingPermission) {
      throw new Error('Permission not found');
    }

    updateData.updatedAt = new Date();
    updateData.updateBy = userId;

    const permission = this.userRepository.merge(
      existingPermission,
      updateData,
    );
    return this.userRepository.save(permission);
  }

  async remove(id: number, userId: number): Promise<void> {
    const existingPermission = await this.userRepository.findOne({
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

    const permission = this.userRepository.merge(
      existingPermission,
      updateData,
    );

    this.userRepository.save(permission);
  }
}
