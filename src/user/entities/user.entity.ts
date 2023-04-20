import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable: true})
    username?: string;

    @Column()
    password?: string;

    @Column({nullable: true})
    headAvatar?: string;

    @Column()
    telphone?: string;

    @Column({default: 0})
    balance?: number;

    @Column({default: 0})
    level?: number;

    @Column({default: 0})
    status?: number;

    @Column({nullable: true})
    createTime?: Date;

    @Column({nullable: true})
    updateTime?: Date;
}
