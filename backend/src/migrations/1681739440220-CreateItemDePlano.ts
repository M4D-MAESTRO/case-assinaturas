import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateItemDePlano1681739440220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "itens_de_plano",
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
                        name: "custo",
                        type: "numeric",
                        isNullable: true,
                    },
                    {
                        name: "quantidade",
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
        await queryRunner.dropTable("itens_de_plano");
    }

}
