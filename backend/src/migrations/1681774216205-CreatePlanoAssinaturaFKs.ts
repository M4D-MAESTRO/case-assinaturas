import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class CreatePlanoAssinaturaFKs1681774216205 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "assinaturas",
            new TableForeignKey({
                name: "FKUserAssinante",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "assinaturas",
            new TableForeignKey({
                name: "FKPlanoAssinatura",
                referencedTableName: "planos_assinatura",
                referencedColumnNames: ["id"],
                columnNames: ["plano_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "itens_planos",
            new TableForeignKey({
                name: "FKItensAssinaturaPlano",
                referencedTableName: "itens_de_plano",
                referencedColumnNames: ["id"],
                columnNames: ["item_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
        await queryRunner.createForeignKey(
            "itens_planos",
            new TableForeignKey({
                name: "FKPlanoAssinaturaItens",
                referencedTableName: "planos_assinatura",
                referencedColumnNames: ["id"],
                columnNames: ["plano_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "itens_planos",
            "FKPlanoAssinaturaItens"
        );
        await queryRunner.dropForeignKey(
            "itens_planos",
            "FKItensAssinaturaPlano"
        );

        await queryRunner.dropForeignKey(
            "assinaturas",
            "FKPlanoAssinatura"
        );
        await queryRunner.dropForeignKey(
            "assinaturas",
            "FKUserAssinante"
        );

    }

}

