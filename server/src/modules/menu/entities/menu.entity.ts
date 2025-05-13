import { CoreEntity } from 'modules/core.entity';
import { Route } from 'modules/routes/entities/route.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

@Entity()
@Tree('nested-set')
export class Menu extends CoreEntity {
    @Column({ default: null })
    parentId: number;

    @Column({ nullable: true })
    path: string;

    @Column({ nullable: true })
    icon: string;

    @Column({
        type: 'enum',
        enum: ['group', 'collapse', 'item'],
        default: 'item',
    })
    type: string;

    @Column({ default: 0 })
    position: number;

    @TreeChildren()
    children: Menu[];

    @TreeParent()
    parent: Menu;

    @ManyToMany(() => Route, (route) => route.menus)
    @JoinTable({
        name: 'menu_has_routes',
        joinColumn: {
            name: 'menu_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'route_id',
            referencedColumnName: 'id',
        },
    })
    routes: Route[];
}
