import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UpdateAssinaturasFK1682335688228 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('assinaturas', new TableColumn({
            name: "forma_pagamento_id",
            type: "uuid",
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('assinaturas', 'forma_pagamento_id');
    }

}
