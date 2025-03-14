import { Injectable } from "@nestjs/common";
import { DataSource, Repository, ILike, Brackets, In } from "typeorm";

import { IFormaPagamentosRepository } from '../IFormaPagamentosRepository';
import { PageOptionsDto } from '../../../../../shared/dtos/page/page-options.dto';
import { FormaPagamento } from "../../entities/forma-pagamento.entity";

@Injectable()
class FormaPagamentosRepository extends Repository<FormaPagamento> implements IFormaPagamentosRepository {

    constructor(private dataSource: DataSource) {
        super(FormaPagamento, dataSource.createEntityManager());
    }

    async findById(id: string, canceled = false): Promise<FormaPagamento> {
        const query = this
            .createQueryBuilder("f")
            .leftJoinAndSelect("f.cartao_cliente", "cartao_cliente")
            .innerJoinAndSelect("f.user_registrou", "user_registrou")
            .where("f.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return await query.getOne();
    }


}

export { FormaPagamentosRepository };
