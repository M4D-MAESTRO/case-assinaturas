import { client_pefil_id, loja_admin_id } from './../shared/constants/system.constant';
import { hash } from "bcrypt";
import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedCliente01673036618726 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user_id = 'f1df6e34-ab41-4637-8527-826f763e25b6';
        const passwordHash = await hash('7hC2ziD5E^h4', 8);

        try {
            await queryRunner.query(`
            insert into users(id, nome, email, senha, cpf, status, perfil_id) 
            values('${user_id}','Cliente Não Identificado', 'clienenaoidentificado@dominio.com', 
            '${passwordHash}', '100000001', 'ATIVO', '${client_pefil_id}');
        `);
        } catch (e) {
            console.error(`Erro ao criar perfil de cliente: ${e.message}`)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
