import { Permission } from 'modules/auth/permission/entities/permission.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { IMetaData } from 'types';

@Entity()
@Tree('nested-set')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: ['guest', 'shared', 'protected', 'devOnly'],
    default: 'guest',
  })
  type: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  path: string;

  @Column({ default: false })
  isComponent: boolean;

  @ManyToMany(() => Permission, (permission) => permission.routes)
  @JoinTable({
    name: 'route_has_permissions',
    joinColumn: {
      name: 'route_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @TreeParent()
  parent: Route;

  @TreeChildren()
  children: Route[];

  @Column({ type: 'json', nullable: true })
  metadata: IMetaData;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 1 })
  status: number;

  @BeforeInsert()
  async generateSlug() {
    this.slug = this.name.toLowerCase().replace(/ /g, '-');
  }
}
