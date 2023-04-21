import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('captcha')
export class Captcha {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    telphone?: string;

    @Column()
    captcha?: string;

    @Column()
    createTime?: Date;

    @Column()
    isAvailable?: boolean;
}

