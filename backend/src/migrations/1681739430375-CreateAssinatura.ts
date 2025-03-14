import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateAssinatura1681739430375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "assinaturas",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    }, 
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false,
                    }, 
                    {
                        name: "plano_id",
                        type: "uuid",
                        isNullable: false,
                    }, 
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                    }, 
                    {
                        name: "data_inicio",
                        type: "timestamp",
                        isNullable: true,
                        default: "now()",
                    }, 
                    {
                        name: "data_fim",
                        type: "timestamp",
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
        await queryRunner.dropTable("assinaturas");
    }

}
