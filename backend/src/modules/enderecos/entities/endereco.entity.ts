import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { v4 as uuidV4 } from "uuid";
  
  @Entity("enderecos")
  export class Endereco {

    @ApiProperty({ description: "ID do endereço", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;
  
    @ApiProperty({ description: "CEP do endereço", example: "20000030" })
    @Column()
    cep: string;
  
    @ApiProperty({ description: "Endereço do endereço", example: "Rua do alfabeto" })
    @Column()
    endereco: string;
  
    @ApiProperty({ description: "Número do endereço", example: "556" })
    @Column()
    numero: string;
  
    @ApiProperty({ description: "Complemento do endereço", example: "Número 106" })
    @Column()
    complemento: string;
  
    @ApiProperty({ description: "Bairro do endereço", example: "Ipiranga" })
    @Column()
    bairro: string;
  
    @ApiProperty({ description: "Cidade do endereço", example: "São Paulo" })
    @Column()
    cidade: string;
  
    @ApiProperty({ description: "Estado do endereço", example: "SP" })
    @Column()
    estado: string;
  
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
    