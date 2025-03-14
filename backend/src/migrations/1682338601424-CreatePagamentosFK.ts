import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class CreatePagamentosFK1682338601424 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "cartao_clientes",
            new TableForeignKey({
                name: "FKUserCartao",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["cliente_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "cartao_clientes",
            new TableForeignKey({
                name: "FKUserAtualizou",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "formas_pagamento",
            new TableForeignKey({
                name: "FKCartaoPagamento",
                referencedTableName: "cartao_clientes",
                referencedColumnNames: ["id"],
                columnNames: ["cartao_cliente_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "formas_pagamento",
            new TableForeignKey({
                name: "FKUserAtualizou",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "assinaturas",
            new TableForeignKey({
                name: "FKPagamento",
                referencedTableName: "formas_pagamento",
                referencedColumnNames: ["id"],
                columnNames: ["forma_pagamento_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "assinaturas",
            "FKPagamento"
        );

        await queryRunner.dropForeignKey(
            "formas_pagamento",
            "FKCartaoPagamento"
        );

        await queryRunner.dropForeignKey(
            "cartao_clientes",
            "FKUserCartao"
        );

        await queryRunner.dropForeignKey(
            "cartao_clientes",
            "FKUserAtualizou"
        );
    }

}
