import { PagamentoFormasEnum } from './../../../../shared/constants/pagamento-formas.constant';
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { User } from "../../../../modules/users/entities/user.entity";
import { CartaoCliente } from "../../cartao-clientes/entities/cartao-cliente.entity";

@Entity("formas_pagamento")
export class FormaPagamento {

    @ApiProperty({ description: "ID do cargo", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Tipo de pagamento", example: PagamentoFormasEnum.CARTAO_CREDITO, enum: PagamentoFormasEnum })
    @Column()
    tipo: PagamentoFormasEnum;

    @ApiProperty({ description: "Cartão do cliente utilizado no pagamento", type: () => CartaoCliente })
    @ManyToOne(() => CartaoCliente)
    @JoinColumn({ name: "cartao_cliente_id" })
    cartao_cliente?: CartaoCliente;

    @ApiProperty({ description: "Usuário que alterou o registro", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_registrou_id" })
    user_registrou: User;

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
