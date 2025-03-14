import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose, Transform } from 'class-transformer';
import { v4 as uuidV4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { AssinaturasEnum } from "./../../../../shared/constants/status-assinaturas.constant";
import { User } from "./../../../../modules/users/entities/user.entity";
import { Plano } from "../../planos/entities/plano.entity";
import { ItemDePlano } from "../../item-de-planos/entities/item-de-plano.entity";

@Entity("itens_planos")
export class ItensPlanos {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Plano, )
    @JoinColumn({ name: "plano_id" })
    plano: Plano;

    @ManyToOne(() => ItemDePlano, )
    @JoinColumn({ name: "item_id" })
    item: ItemDePlano;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
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