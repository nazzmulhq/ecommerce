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
    is_menu: boolean;

    @Column({ default: false })
    is_sub_menu: boolean;

    @Column({ default: false })
    is_dynamic_route: boolean;

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
    async menuSubMenuAndDynamicRoute() {
        // Handle menu/submenu based on parent existence (root has no parent)
        if (this.parent) {
            this.is_menu = false;
            this.is_sub_menu = true; // Direct child becomes submenu
        } else {
            this.is_menu = true; // No parent means it's a top-level menu
            this.is_sub_menu = false;
        }

        // Determine dynamic route using regex test (safer than match)
        this.is_dynamic_route = /\[.*?\]/.test(this.path || '');
    }

    @BeforeInsert()
    async generateSlug() {
        if (this.path && this.path !== '/') {
            const paths = this.path.split('/');
            const lastSegment = paths[paths.length - 1];

            // Check if it's a dynamic route segment with square brackets
            if (lastSegment.startsWith('[') && lastSegment.endsWith(']')) {
                // Extract the parameter name without square brackets
                this.slug = lastSegment.substring(1, lastSegment.length - 1);
            } else {
                this.slug = lastSegment;
            }
        } else {
            this.slug = this.name.toLowerCase().replace(/ /g, '-');
        }
    }
}
