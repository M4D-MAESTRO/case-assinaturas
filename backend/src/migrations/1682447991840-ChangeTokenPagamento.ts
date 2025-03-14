import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ChangeTokenPagamento1682447991840 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('formas_pagamento', 'token_pagamento');

        await queryRunner.addColumn('cartao_clientes', new TableColumn({
            name: "token_pagamento",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('cartao_clientes', 'token_pagamento');

        await queryRunner.addColumn('formas_pagamento', new TableColumn({
            name: "token_pagamento",
            type: "varchar",
            isNullable: true,
        }));
    }

}
