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
import { StatusCartaoEnum, TipoCartaoEnum } from "./../../../../shared/constants/cartao.constant";

@Entity("cartao_clientes")
export class CartaoCliente {

    @ApiProperty({ description: "ID do cargo", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Número do cartão", example: "1234567890123456" })
    @Exclude()
    @Column()
    numero_cartao: string;

    @ApiProperty({ description: "Nome do titular do cartão", example: "Luís Henrique..." })
    @Column()
    nome_titular: string;

    @ApiProperty({ description: "Validade do cartão", example: "08/23" })
    @Column()
    validade: string;

    @ApiProperty({ description: "Token de pagamento utilizado", example: 'tok_1N0X4U2eZvKYlo2CUQXhaTrt' })
    @Column()
    @Expose({ groups: ["get-token"] })
    token_pagamento?: string;

    @ApiProperty({ description: "Últimos quatro dígitos do cartão", example: "3456" })
    @Column()
    ultimos_digitos: string;

    @ApiProperty({ description: "Status do cartão no sistema", example: StatusCartaoEnum.ATIVO, enum: StatusCartaoEnum })
    @Column()
    status: StatusCartaoEnum;

    @ApiProperty({ description: "Tipo de cartão no sistema", example: TipoCartaoEnum.CREDITO, enum: TipoCartaoEnum })
    @Column()
    tipo: TipoCartaoEnum;

    @ApiProperty({ description: "Cliente proprietário do cartão", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "cliente_id" })
    cliente: User;

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
