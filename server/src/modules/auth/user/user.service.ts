import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'modules/auth/role/entities/role.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleRepository.find({
      where: {
        id: In(createUserDto.roleId),
      },
    });
    if (!roles || roles.length === 0) {
      throw new Error('Role not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.roles = roles;
    user.createBy = 0;
    user.createdAt = new Date();

    return this.userRepository.save(user);
  }

  async showById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['roles', 'roles.permissions'],
    });
    delete user.password;
    return user;
  }

  async showByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['roles', 'roles.permissions'],
      select: ['id', 'name', 'email', 'isSuperAdmin', 'roles'],
    });

    return user;
  }

  async findById(id: number) {
    return await User.findOne(id as FindOneOptions<User>);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['roles', 'roles.permissions'],
    });
    return user;
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['roles'],
    });
  }

  async update(id: number, updateUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = await this.roleRepository.find({
      where: {
        id: In(
          Array.isArray(updateUserDto.roleId)
            ? updateUserDto.roleId
            : [updateUserDto.roleId],
        ),
      },
    });

    if (roles || roles.length > 0) {
      user.roles = roles;
    }

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.updatedAt = new Date();
    user.updateBy = 0;

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updateData = {
      updatedAt: new Date(),
      updateBy: 0,
      status: 0,
    };

    return this.userRepository.update(id, updateData);
  }
}
