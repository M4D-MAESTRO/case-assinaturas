import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class UpdatePlanoWithUserRegistrou1681986007163 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('planos_assinatura', new TableColumn({
            name: "user_registrou_id",
            type: "uuid",
            isNullable: true
        }));

        await queryRunner.addColumn('assinaturas', new TableColumn({
            name: "user_registrou_id",
            type: "uuid",
            isNullable: true
        }));

        await queryRunner.createForeignKey(
            "planos_assinatura",
            new TableForeignKey({
                name: "FKUserRegistrou",
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
                name: "FKUserRegistrou",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["user_registrou_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "assinaturas",
            "FKUserRegistrou"
        );
        await queryRunner.dropForeignKey(
            "planos_assinatura",
            "FKUserRegistrou"
        );

        await queryRunner.dropColumn('assinaturas', 'user_registrou_id');
        await queryRunner.dropColumn('assinaturas', 'planos_assinatura');
    }

}
