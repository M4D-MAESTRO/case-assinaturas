import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateCartaoCliente1682335562171 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cartao_clientes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                        isPrimary: true,
                    }, 
                    {
                        name: "cliente_id",
                        type: "uuid",
                        isNullable: false,
                    }, 
                    {
                        name: "user_registrou_id",
                        type: "uuid",
                        isNullable: false,
                    }, 
                    {
                        name: "numero_cartao",
                        type: "varchar",
                        isNullable: false,
                    }, 
                    {
                        name: "nome_titular",
                        type: "varchar",
                        isNullable: false,
                    }, 
                    {
                        name: "validade",
                        type: "varchar",
                        isNullable: false,
                    }, 
                    {
                        name: "ultimos_digitos",
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
        await queryRunner.dropTable("cartao_clientes");
    }

}
