
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

import { ArquivosTipoEnum } from "./../../../../shared/constants/arquivos-tipo.constant";
import { User } from './../../../../modules/users/entities/user.entity';
import { ProvidersEnum } from './../../../constants/providers.constant';

@Entity("arquivos_gerais")
export class ArquivoGeral {

    @ApiProperty({ description: "ID do arquivo", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Nome do arquivo", example: "comprovante.xml" })
    @Column()
    nome: string;

    @ApiProperty({ description: "Descrição do arquivo", example: "Comprovante de pagamento" })
    @Column()
    descricao?: string;

    @ApiProperty({ description: "Bucket onde se encontra o arquivo", example: "s3-bucket_name" })
    @Column()
    bucket: string;

    @ApiProperty({ description: "Provedor onde o arquivo se encontra", example: ProvidersEnum.AWS, enum: ProvidersEnum })
    @Column()
    provedor: ProvidersEnum;

    @ApiProperty({ description: "Tamanho do arquivo", example: 150000 })
    @Column()
    tamanho: number;

    @ApiProperty({ description: "Tipo do arquivo", example: ArquivosTipoEnum.CSV, enum: ArquivosTipoEnum })
    @Column()
    tipo: ArquivosTipoEnum;

    @ApiProperty({ description: 'Permissões do arquivo', example: '{"read": true, "write": true, "delete": false}' })
    @Column()
    permissoes: string;

    @ApiProperty({ description: 'Metadados do arquivo', example: '{"autor": "John Doe", "data_criacao": "2023-05-17"}' })
    @Column()
    metadados: string;

    @ApiProperty({ description: "Usuário que cadastrou a area", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
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

