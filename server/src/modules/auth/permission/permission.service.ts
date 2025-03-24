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

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
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

    const permission = this.userRepository.merge(
      existingPermission,
      updateData,
    );
    return this.userRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const existingPermission = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!existingPermission) {
      throw new Error('Permission not found');
    }
    const permission = this.userRepository.merge(existingPermission, {
      status: 0,
    });

    this.userRepository.save(permission);
  }
}
