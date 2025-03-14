
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
import { AssinaturasEnum } from "./../../../../shared/constants/status-assinaturas.constant";
import { User } from "./../../../../modules/users/entities/user.entity";
import { ItensPlanos } from "../../itens-planos/entities/itens-planos.entity";

@Entity("planos_assinatura")
export class Plano {

    @ApiProperty({ description: "ID do plano", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Nome do plano", example: 'Plano sócio nível 1' })
    @Column()
    nome: string;

    @ApiProperty({ description: "Descrição do plano", example: 'Plano recomendado para quem deseja ser sócio...' })
    @Column()
    descricao: string;

    @ApiProperty({ description: "Valor do plano mensalmente", example: 50.99 })
    @Column()
    valor_mensal: number;

    @ApiProperty({ description: "Valor do plano trimestral", example: 140.99 })
    @Column()
    valor_trimestral: number;

    @ApiProperty({ description: "Valor do plano semestral", example: 260.90 })
    @Column()
    valor_semestral: number;

    @ApiProperty({ description: "Valor do plano anual", example: 500.00 })
    @Column()
    valor_anual: number;

    @ApiProperty({
        description: "Custo que o plano gera mensalmente à corporação \nSe não for preenchido, o sistema calculará com base nos itens associados",
        example: 50.00
    })
    @Column()
    custo_mensal: number;

    @ApiProperty({ description: "Lista de itens que o plano cobre", type: () => User, isArray: true })
    @OneToMany(() => ItensPlanos, ItensPlanos => ItensPlanos.plano, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    itens: ItensPlanos[];

    @ApiProperty({ description: "Usuário que cadastrou o plano", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_registrou_id" })
    @Expose({ groups: ["find"] })
    user_registrou?: User;

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
