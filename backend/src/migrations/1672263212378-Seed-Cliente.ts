import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedCliente1672263212378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const id = 'a11217ac-e9fd-42f9-b1b3-2cacda380cc2';

        try {
            await queryRunner.query(`
        insert into perfis(id, nome, descricao) values('${id}','CLIENTE', 'Cliente da companhia');
        `);
        } catch (e) {
            console.error(`Erro ao criar perfil de cliente: ${e.message}`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
