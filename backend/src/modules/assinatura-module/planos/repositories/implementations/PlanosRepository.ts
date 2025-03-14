
import { Injectable } from "@nestjs/common";

import { DataSource, Repository, ILike, Brackets } from "typeorm";
import { IPlanosRepository } from "../IPlanosRepository";
import { Plano } from "../../entities/plano.entity";
import { SearchPlanoDto } from '../../dto/search-plano.dto';
import { PageOptionsDto } from '../../../../../shared/dtos/page/page-options.dto';


@Injectable()
class PlanosRepository extends Repository<Plano> implements IPlanosRepository {

    constructor(private dataSource: DataSource) {
        super(Plano, dataSource.createEntityManager());
    }

    async desassociarItens(plano_id: string, ids: string[]) {
        const idsQuery = ids.map(id => `'${id}'`).join(',');
        //console.log(`delete from itens_planos ip where ip.plano_id = '${plano_id}' and ip.item_id in (${idsQuery})`);
        await this.query(`delete from itens_planos ip where ip.plano_id = '${plano_id}' and ip.item_id in (${idsQuery})`)
    }

    async listByIds(ids: string[]): Promise<[Plano[], number]> {
        const query = this
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.itens", "i")
            .leftJoinAndSelect("i.item", "item")
            .where("i.id in (:...ids )'", { ids });

        return await query.getManyAndCount();
    }

    async findById(id: string, canceled = false): Promise<Plano> {
        const query = this
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.itens", "i")
            .leftJoinAndSelect("i.item", "item")
            .where("p.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return query.getOne();
    }

    async list(
        { skip, take, order }: PageOptionsDto,
        {
            created_at, descricao, nome, searchedPlano,
            min_custo_mensal, min_valor_anual, min_valor_mensal, min_valor_semestral, min_valor_trimestral,
            max_custo_mensal, max_valor_anual, max_valor_mensal, max_valor_semestral, max_valor_trimestral,
        }: SearchPlanoDto
    ): Promise<[Plano[], number]> {

        const query = this
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.itens", "i")
            .leftJoinAndSelect("i.item", "item")
            .orderBy("p.created_at", order)
            .skip(skip)
            .take(take)
            .where("1=1");

        if (created_at) {
            query.andWhere("p.created_at::date = :created_at", { created_at: new Date(created_at) });
        }
        if (nome) {
            query.andWhere("p.nome ILIKE :nome", { nome: `%${nome}%` });
        }

        if (descricao) {
            query.andWhere("p.descricao ILIKE :descricao", { descricao: `%${descricao}%` });
        }
        if (searchedPlano) {
            query.andWhere(new Brackets(qb => {
                qb.where("p.id::text ILIKE :item_de_plano_id OR p.nome ILIKE :searched_nome OR p.descricao ILIKE :searched_descricao ", {
                    item_de_plano_id: `%${searchedPlano}%`,
                    searched_nome: `%${searchedPlano}%`,
                    searched_descricao: `%${searchedPlano}%`,
                });
            }));
        }

        if (min_custo_mensal) {
            query.andWhere("p.valor_mensal >= :min_custo_mensal", { min_custo_mensal });
        }

        if (max_custo_mensal) {
            query.andWhere("p.valor_mensal <= :max_custo_mensal", { max_custo_mensal });
        }

        if (min_valor_anual) {
            query.andWhere("p.valor_anual >= :min_valor_anual", { min_valor_anual });
        }

        if (max_valor_anual) {
            query.andWhere("p.valor_anual <= :max_valor_anual", { max_valor_anual });
        }


        if (min_valor_mensal) {
            query.andWhere("p.valor_mensal >= :min_valor_mensal", { min_valor_mensal });
        }

        if (max_valor_mensal) {
            query.andWhere("p.valor_mensal <= :max_valor_mensal", { max_valor_mensal });
        }

        if (min_valor_semestral) {
            query.andWhere("p.valor_semestral >= :min_valor_semestral", { min_valor_semestral });
        }

        if (max_valor_semestral) {
            query.andWhere("p.valor_semestral <= :max_valor_semestral", { max_valor_semestral });
        }

        if (min_valor_trimestral) {
            query.andWhere("p.valor_semestral >= :min_valor_trimestral", { min_valor_trimestral });
        }

        if (max_valor_trimestral) {
            query.andWhere("p.valor_trimestral <= :max_valor_trimestral", { max_valor_trimestral });
        }

        const planos = await query.getManyAndCount();
        return planos;
    }

}

export { PlanosRepository };
