import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose, Transform } from 'class-transformer';
import { v4 as uuidV4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { AssinaturasEnum } from "../../../../shared/constants/status-assinaturas.constant";
import { User } from "../../../users/entities/user.entity";
import { ItensPlanos } from "../../itens-planos/entities/itens-planos.entity";

@Entity("itens_de_plano")
export class ItemDePlano {

    @ApiProperty({ description: "ID do plano", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Nome do item", example: 'Cortes de cabelo ilimitado' })
    @Column()
    nome: string;

    @ApiProperty({ description: "Descrição do item", example: 'Direito a cortar o cabelo ilimitadamente, seja corte feminino ou masculino' })
    @Column()
    descricao: string;

    @ApiProperty({ description: "Custo do item", example: 20.99 })
    @Column()
    custo?: number;

    @ApiProperty({ description: "Quantidade de itens disponível mensalmente", example: 2 })
    @Column()
    quantidade?: number;

    @ApiProperty({ description: "Lista de planos que incluem o item", type: () => User, isArray: true })
    @OneToMany(() => ItensPlanos, ItensPlanos => ItensPlanos.item, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    planos?: ItensPlanos[];

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
