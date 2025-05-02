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

    @Column({ nullable: true })
    parent_id: null | number;

    @Column({ unique: true })
    path: string;

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

    @TreeParent()
    parent: Route;

    @TreeChildren()
    children: Route[];

    @Column({ type: 'json', nullable: true })
    metadata: IMetaData;

    @BeforeInsert()
    async menuSubMenuAndDynamicRoute() {
        // Menu is the root node
        // Submenu is the child node of the menu
        // If parent_id is 1, then it is a menu
        // If parent_id is not 1, then it is a submenu
        if (this.parent_id === 1) {
            this.is_menu = true;
        } else {
            this.is_sub_menu = true;
        }

        // Path is dynamic if it contains a parameter in square brackets
        // e.g. /users/[id] or /users/[id]/posts/[postId]
        // check if the path contains any square brackets
        const regex = /\[(.*?)\]/g;
        const matches = this.path.match(regex);
        if (matches) {
            this.is_dynamic_route = true;
        } else {
            this.is_dynamic_route = false;
        }
    }
}
