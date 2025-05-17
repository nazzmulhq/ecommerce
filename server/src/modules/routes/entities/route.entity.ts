import { Permission } from 'modules/auth/permission/entities/permission.entity';
import { CoreEntity } from 'modules/core.entity';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { IMetaData } from 'types';

@Entity()
@Tree('nested-set')
export class Route extends CoreEntity {
    @Column({
        type: 'enum',
        enum: ['guest', 'shared', 'protected', 'devOnly'],
        default: 'guest',
    })
    type: string;

    @Column({ default: null, unique: true })
    path: string;

    @Column({ default: null })
    icon: string;

    @Column({ default: 0 })
    position: number;

    @Column({ default: false })
    is_dynamic_route: boolean;

    @Column({ default: false })
    not_show_in_menu: boolean;

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

    @Column({ default: null })
    parentId: number;

    @TreeParent()
    parent: Route;

    @TreeChildren()
    children: Route[];

    @Column({ type: 'json', nullable: true })
    metadata: IMetaData;

    @BeforeInsert()
    async generateSlug() {
        // Skip slug generation for dynamic routes
        if (this.path && this.path.includes(':')) {
            this.is_dynamic_route = true;
            this.slug = this.path; // Keep the original path for dynamic routes
            return; // Skip slug generation for dynamic routes
        }

        if (this.path && this.path !== '/') {
            const paths = this.path.split('/');
            if (paths.length > 1) {
                this.slug = paths[paths.length - 1];
            } else {
                this.slug = this.path;
            }
        } else {
            this.slug = this.name.toLowerCase().replace(/ /g, '/');
        }
    }
}
