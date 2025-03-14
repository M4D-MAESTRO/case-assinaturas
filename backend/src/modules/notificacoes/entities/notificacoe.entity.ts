
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "../../../modules/users/entities/user.entity";

@Entity("notificacoes")
export class Notificacao {

    @PrimaryColumn()
    id: string;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @Column()
    tipo: string;

    @Column()
    status: string;

    @Column()
    is_read: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: "requester_user_id" })
    requester_user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }

}