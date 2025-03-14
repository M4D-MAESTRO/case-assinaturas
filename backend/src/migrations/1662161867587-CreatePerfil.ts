import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreatePerfil1662161867587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "perfis",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "descricao",
                        type: "varchar",
                        isNullable: false,
                        isUnique: false,
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

        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "perfil_id",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
                name: "FKPerfilUser",
                referencedTableName: "perfis",
                referencedColumnNames: ["id"],
                columnNames: ["perfil_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("users", "FKPerfilUser");
        await queryRunner.dropColumn("users", "perfil_id");
        await queryRunner.dropTable("perfis");
    }

}
