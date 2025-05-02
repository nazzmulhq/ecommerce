import { Permission } from 'modules/auth/permission/entities/permission.entity';
import { CoreEntity } from 'modules/core.entity';
import { User } from 'modules/user/entities/user.entity';

import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Role extends CoreEntity {
    @OneToMany(() => User, (user) => user.roles)
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    permissions: Permission[];
}
