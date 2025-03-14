import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateBullJobs1665399269546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bull_jobs_history",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "job_id",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "attempts_made",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "failed_reason",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "email_to",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "started_on",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "processed_on",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "finished_on",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bull_jobs_history");
    }

}
