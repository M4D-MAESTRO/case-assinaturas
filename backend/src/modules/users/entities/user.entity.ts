import { DefaultValuesUtils } from './../../../shared/utils/defaultValuesUtils';

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

import { Endereco } from "../../../modules/enderecos/entities/endereco.entity";
import { Perfil } from "../../../modules/perfis/entities/perfil.entity";
import { getFileUrl } from "../../../shared/utils/fileLoader";
import { FolderPathEnum } from "../../../shared/constants/folder-path.constant";

@Entity("users")
export class User {

    @ApiProperty({ description: "ID do Usuário", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Nome do Usuário", example: "Henrique de Castro" })
    @Column()
    nome: string;

    @ApiProperty({ description: "E-mail do Usuário", example: "exemplo@exemplo.com" })
    @Column()
    email: string;

    @Column()
    @Exclude()
    senha: string;

    @ApiProperty({ description: "CPF do Usuário", example: "12345678999" })
    @Column()
    cpf: string;

    @ApiProperty({ description: "Arquivo do avatar usado pelo Usuário", example: "IMG-exemplo.png" })
    @Column()
    avatar: string;

    @ApiProperty({ description: "URL do avatar usado pelo Usuário", example: "https://exemplo/IMG-exemplo.png" })
    @Expose()
    get avatar_url(): string {
        const { bucket, provedor } = process.env.MODE == 'DEV' ?
            DefaultValuesUtils.getDevelopmentProviderAndBucket() :
            DefaultValuesUtils.getProductionProviderAndBucket();

        return this.avatar ? getFileUrl(this.avatar, FolderPathEnum.USER_AVATAR, bucket, provedor) : null
    }

    @ApiProperty({ description: "Se o Usuário é administrador", example: false })
    @Column()
    is_admin: boolean;

    @ApiProperty({ description: "Status atual do Usuário", examples: ["ATIVO", "AFASTADO", "FÉRIAS", "DESLIGADO", "DELETADO",] })
    @Column()
    status: string;

    @ApiProperty({ description: "Perfil atual do Usuário", type: () => Perfil })
    @ManyToOne(() => Perfil)
    @JoinColumn({ name: "perfil_id" })
    perfil: Perfil;

    @ApiProperty({ description: "Endereço atual do Usuário", type: () => Endereco })
    @OneToOne(() => Endereco, { cascade: true })
    @JoinColumn({ name: "endereco_id" })
    endereco: Endereco;

    @ApiProperty({ description: "Socket ID do Usuário", example: "123456789" })
    @Column()
    socket_id: string;

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

