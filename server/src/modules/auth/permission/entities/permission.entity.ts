import { Role } from 'modules/auth/role/entities/role.entity';
import { Route } from 'modules/routes/entities/route.entity';

import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @ManyToMany(() => Route, (route) => route.permissions)
  routes: Route[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  createBy: number;

  @Column({ default: 0 })
  updateBy: number;

  @Column({ default: 1 })
  status: number;

  @BeforeInsert()
  async generatorSlug() {
    this.slug = this.name.toLowerCase().replace(/ /g, '-');
  }
}
