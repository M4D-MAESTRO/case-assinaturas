import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterItensPlanos1682036120048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itens_planos" ALTER COLUMN "plano_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "itens_planos" ALTER COLUMN "item_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itens_planos" ALTER COLUMN "plano_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "itens_planos" ALTER COLUMN "item_id" SET NOT NULL`);
    }

}
