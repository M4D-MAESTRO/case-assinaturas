import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class FormaPagamento1682335672296 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "formas_pagamento",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    }, 
                    {
                        name: "cartao_cliente_id",
                        type: "uuid",
                        isNullable: true,
                    }, 
                    {
                        name: "user_registrou_id",
                        type: "uuid",
                        isNullable: false,
                    }, 
                    {
                        name: "tipo",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "token_pagamento",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ]
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("formas_pagamento");
    }

}
