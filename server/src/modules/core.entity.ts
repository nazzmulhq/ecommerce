// entities/base.entity.ts
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    @Index()
    id: number;

    @Column({ unique: true })
    @Index()
    slug: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    bn_name: string;

    @Column({ default: 1 })
    status: number;

    @Column({ default: 0 })
    created_by: number;

    @Column({ default: 0 })
    updated_by: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    async generateSlug() {
        this.slug = this.name.toLowerCase().replace(/ /g, '-');
    }
}
