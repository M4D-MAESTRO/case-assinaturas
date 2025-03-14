import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePlano1681739424679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "planos_assinatura",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "valor_mensal",
                        type: "numeric",
                        isNullable: false,
                    },
                    {
                        name: "valor_trimestral",
                        type: "numeric",
                        isNullable: true,
                    },
                    {
                        name: "valor_semestral",
                        type: "numeric",
                        isNullable: true,
                    },
                    {
                        name: "valor_anual",
                        type: "numeric",
                        isNullable: true,
                    },
                    {
                        name: "custo_mensal",
                        type: "numeric",
                        isNullable: true,
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
        await queryRunner.dropTable("planos_assinatura");
    }

}
