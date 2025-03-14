import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UpdateAssinaturasAddFieldModalidade1682288845220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('assinaturas', new TableColumn({
            name: "modalidade",
            type: "varchar",
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('assinaturas', 'modalidade');
    }

}
