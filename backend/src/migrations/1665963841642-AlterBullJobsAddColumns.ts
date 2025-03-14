import { hash } from "bcrypt";
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AlterBullJobsAddColumns1665963841642 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('bull_jobs_history', new TableColumn({
            name: "job_type",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.addColumn('bull_jobs_history', new TableColumn({
            name: "requester_user_id",
            type: "uuid",
            isNullable: true,
        }));

        await queryRunner.addColumn('bull_jobs_history', new TableColumn({
            name: "affected_tables",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.createForeignKey(
            "bull_jobs_history",
            new TableForeignKey({
                name: "FKUsuarioRequisitante",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["requester_user_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        );

        try {
            const passwordHash = await hash('Sys!2re98@3dSC', 8);
            await queryRunner.query(`
        insert into users(id, nome, email, senha, cpf, status) values('4eaf1c7c-72fd-499d-810e-5666aaae60a9','SYSTEM', 'system@dominio.com', '${passwordHash}', '000000001', 'ATIVO');
        `);
        } catch (e) {
            console.error(`Erro ao criar o usuario SYSTEM: ${e.message}`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "bull_jobs_history",
            "FKUsuarioRequisitante"
        );
        await queryRunner.dropColumn('bull_jobs_history', 'job_type');
        await queryRunner.dropColumn('bull_jobs_history', 'requester_user_id');
        await queryRunner.dropColumn('bull_jobs_history', 'affected_tables');
    }

}
