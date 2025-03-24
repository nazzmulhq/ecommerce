import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'modules/auth/role/entities/role.entity';
import { FindOneOptions, Repository } from 'typeorm';
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
    const role = await this.roleRepository.findOne({
      where: {
        id: createUserDto.roleId,
      },
    });

    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.role = role;
    return this.userRepository.save(user);
  }

  async showById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['role', 'role.permissions'],
    });
    delete user.password;
    return user;
  }

  async showByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['role', 'role.permissions'],
      select: ['id', 'name', 'email', 'isSuperAdmin', 'role'],
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
      relations: ['role', 'role.permissions'],
    });
    return user;
  }
}
