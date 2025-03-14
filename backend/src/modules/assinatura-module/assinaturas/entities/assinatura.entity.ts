import { FormaPagamento } from './../../../adm-pagamentos/forma-pagamentos/entities/forma-pagamento.entity';

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
import { ModalidadesAssinaturaEnum } from "./../../../../shared/constants/modalidade-assinaturas.const";

@Entity("assinaturas")
export class Assinatura {

    @ApiProperty({ description: "ID da assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Status da assinatura", example: AssinaturasEnum.ATIVO, enum: AssinaturasEnum })
    @Column()
    status: AssinaturasEnum;

    @ApiProperty({ description: "Modalidade da assinatura", example: ModalidadesAssinaturaEnum.MENSAL, enum: ModalidadesAssinaturaEnum })
    @Column()
    modalidade: ModalidadesAssinaturaEnum;

    @ApiProperty({ description: "Plano associado à assinatura", type: () => Plano })
    @ManyToOne(() => Plano)
    @JoinColumn({ name: "plano_id" })
    plano_assinatura: Plano;

    @ApiProperty({ description: "Usuário inscrito na assinatura", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    assinante: User;

    @ApiProperty({ description: "Forma de pagamento atual do Usuário", type: () => FormaPagamento })
    @OneToOne(() => FormaPagamento)
    @JoinColumn({ name: "forma_pagamento_id" })
    forma_pagamento: FormaPagamento;

    @ApiProperty({ description: "Usuário que cadastrou o plano", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_registrou_id" })
    @Expose({ groups: ["find"] })
    user_registrou?: User;

    @Column()
    data_inicio: Date;

    @Column()
    data_fim: Date;

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
