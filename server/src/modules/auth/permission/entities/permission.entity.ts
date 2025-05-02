import { Role } from 'modules/auth/role/entities/role.entity';
import { CoreEntity } from 'modules/core.entity';
import { Route } from 'modules/routes/entities/route.entity';

import { Entity, ManyToMany } from 'typeorm';

@Entity()
export class Permission extends CoreEntity {
    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];

    @ManyToMany(() => Route, (route) => route.permissions)
    routes: Route[];
}
