import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateEndereco1662162842553 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "enderecos",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "cep",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "endereco",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "numero",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "complemento",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "bairro",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "cidade",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "estado",
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
                ],
            })
        );

        await queryRunner.addColumn(
            "users",
            new TableColumn({
              name: "endereco_id",
              type: "uuid",
              isNullable: true,
            })
          );
      
          await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
              name: "FKEnderecoUser",
              referencedTableName: "enderecos",
              referencedColumnNames: ["id"],
              columnNames: ["endereco_id"],
              onDelete: "SET NULL",
              onUpdate: "SET NULL",
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("users", "FKEnderecoUser");
        await queryRunner.dropColumn("users", "endereco_id");
        await queryRunner.dropTable("enderecos");
    }

}
