import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateNotificacoes1666560375235 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "notificacoes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
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
                        name: "tipo",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "is_read",
                        type: "boolean",
                        isNullable: false,
                    },
                    {
                        name: "requester_user_id",
                        type: "uuid",
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
                ],
            })
        );

        await queryRunner.createForeignKey(
            "notificacoes",
            new TableForeignKey({
                name: "FKUsuarioRequisitante",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["requester_user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "notificacoes",
            "FKUsuarioRequisitante"
        );
        await queryRunner.dropTable("notificacoes");
    }

}
