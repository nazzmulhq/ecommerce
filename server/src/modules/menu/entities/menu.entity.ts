import { CoreEntity } from 'modules/core.entity';
import { Route } from 'modules/routes/entities/route.entity';
import {
    Column,
    Entity,
    OneToMany,
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

    @OneToMany(() => Route, (route) => route.menus)
    routes: Route[];
}
