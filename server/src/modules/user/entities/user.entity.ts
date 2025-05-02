import * as bcrypt from 'bcryptjs';
import { Role } from 'modules/auth/role/entities/role.entity';
import { CoreEntity } from 'modules/core.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class User extends CoreEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    isSuperAdmin: number;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
