import { PageOptionsDto } from './../../../../../shared/dtos/page/page-options.dto';

import { Injectable } from "@nestjs/common";

import { DataSource, Repository, ILike, Brackets, In } from "typeorm";
import { IItensDePlanosRepository } from "../IItensDePlanosRepository";
import { ItemDePlano } from "../../entities/item-de-plano.entity";
import { SearchItemDePlanoDto } from '../../dto/search-item-de-plano.dto';


@Injectable()
class ItensDePlanosRepository extends Repository<ItemDePlano> implements IItensDePlanosRepository {

    constructor(private dataSource: DataSource) {
        super(ItemDePlano, dataSource.createEntityManager());
    }

    async listByIds(ids: string[]): Promise<[ItemDePlano[], number]> {
        const query = this
            .createQueryBuilder("i")
            .leftJoinAndSelect("i.planos", "planos")
            .where("i.id in (:...ids )", { ids });

        return await query.getManyAndCount();
    }

    async findById(id: string, canceled = false): Promise<ItemDePlano> {
        const query = this
            .createQueryBuilder("i")
            .leftJoinAndSelect("i.planos", "planos")
            .where("i.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return await query.getOne();
    }

    async list(
        { skip, take, order }: PageOptionsDto,
        {
            created_at, descricao, max_quantidade, max_custo, min_custo, min_quantidade,
            nome, searchedItem,
        }: SearchItemDePlanoDto
    ): Promise<[ItemDePlano[], number]> {

        const query = this
            .createQueryBuilder("i")
            .leftJoinAndSelect("i.planos", "planos")
            .orderBy("i.created_at", order)
            .skip(skip)
            .take(take)
            .where("1=1");

        if (created_at) {
            query.andWhere("i.created_at::date = :created_at", { created_at: new Date(created_at) });
        }
        if (nome) {
            query.andWhere("i.nome LIKE :nome", { nome: `%${nome}%` });
        }

        if (descricao) {
            query.andWhere("i.descricao LIKE :descricao", { descricao: `%${descricao}%` });
        }


        if (searchedItem) {
            query.andWhere(new Brackets(qb => {
                qb.where("i.id::text ILIKE :item_de_plano_id", {
                    item_de_plano_id: `%${searchedItem}%`,
                });
            }));
        }

        if (min_quantidade) {
            query.andWhere("i.quantidade >= :min_quantidade", { min_quantidade });
        }

        if (max_quantidade) {
            query.andWhere("i.quantidade <= :max_quantidade", { max_quantidade });
        }

        if (min_custo) {
            query.andWhere("i.custo >= :min_custo", { min_custo });
        }

        if (max_custo) {
            query.andWhere("i.custo <= :max_custo", { max_custo });
        }

        const itensDePlanos = await query.getManyAndCount();
        return itensDePlanos;
    }

}

export { ItensDePlanosRepository };
