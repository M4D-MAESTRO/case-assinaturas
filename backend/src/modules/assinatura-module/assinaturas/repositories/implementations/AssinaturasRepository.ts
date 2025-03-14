
import { Injectable } from "@nestjs/common";

import { DataSource, Repository, ILike, Brackets, In } from "typeorm";
import { IAssinaturasRepository } from '../IAssinaturasRepository';
import { Assinatura } from '../../entities/assinatura.entity';
import { SearchAssinaturaDto } from '../../dto/search-assinatura.dto';
import { AssinaturasEnum } from './../../../../../shared/constants/status-assinaturas.constant';
import { PageOptionsDto } from '../../../../../shared/dtos/page/page-options.dto';


@Injectable()
class AssinaturasRepository extends Repository<Assinatura> implements IAssinaturasRepository {

    constructor(private dataSource: DataSource) {
        super(Assinatura, dataSource.createEntityManager());
    }

    async findById(id: string, canceled = false): Promise<Assinatura> {
        const query = this
            .createQueryBuilder("a")
            .innerJoinAndSelect("a.plano_assinatura", "plano")
            .innerJoinAndSelect("a.assinante", "assinante")
            .innerJoinAndSelect("a.user_registrou", "user_registrou")
            .innerJoinAndSelect("a.forma_pagamento", "forma_pagamento")
            .leftJoinAndSelect("forma_pagamento.cartao_cliente", "cartao_cliente")
            .where("a.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return await query.getOne();
    }

    async findByUserIdAndPlanoId(user_id: string, plano_id: string): Promise<Assinatura> {
        const query = this
            .createQueryBuilder("a")
            .innerJoinAndSelect("a.plano_assinatura", "plano")
            .innerJoinAndSelect("a.assinante", "assinante")
            .innerJoinAndSelect("a.user_registrou", "user_registrou")
            .innerJoinAndSelect("a.forma_pagamento", "forma_pagamento")
            .leftJoinAndSelect("forma_pagamento.cartao_cliente", "cartao_cliente")
            .where("assinante.id = :user_id", { user_id })
            .andWhere("plano.id = :plano_id", { plano_id });


        return await query.getOne();
    }

    async list(
        { skip, take, order }: PageOptionsDto,
        {
            created_at, assinante_id, data_fim, data_inicio, searchedAssinante,
            searchedPlano, plano_assinatura_id, searchedAssinatura, status, modalidade
        }: SearchAssinaturaDto
    ): Promise<[Assinatura[], number]> {

        const query = this
            .createQueryBuilder("a")
            .innerJoinAndSelect("a.plano_assinatura", "plano")
            .innerJoinAndSelect("a.assinante", "assinante")
            .innerJoinAndSelect("a.user_registrou", "user_registrou")
            .orderBy("a.created_at", order)
            .skip(skip)
            .take(take)
            .where("1=1");

        if (created_at) {
            query.andWhere("a.created_at::date = :created_at", { created_at: new Date(created_at) });
        }

        if (data_inicio) {
            query.andWhere("a.data_inicio::date = :data_inicio", { data_inicio: new Date(data_inicio) });
        }

        if (data_fim) {
            query.andWhere("a.data_fim::date = :data_fim", { created_at: new Date(data_fim) });
        }

        if (plano_assinatura_id) {
            query.andWhere("plano.id = :plano_assinatura_id", { plano_assinatura_id });
        }

        if (assinante_id) {
            query.andWhere("assinante.id = :assinante_id", { assinante_id });
        }

        if (searchedAssinante) {
            query.andWhere(new Brackets(qb => {
                qb.where("assinante.id::text ILIKE :searchedAssinante", {
                    searchedAssinante: `%${searchedAssinante}%`,
                });
            }));
        }

        if (searchedAssinatura) {
            query.andWhere(new Brackets(qb => {
                qb.where("a.id::text ILIKE :searchedAssinatura", {
                    searchedAssinatura: `%${searchedAssinatura}%`,
                });
            }));
        }

        if (searchedPlano) {
            query.andWhere(new Brackets(qb => {
                qb.where("plano.id::text ILIKE :searchedPlano", {
                    searchedPlano: `%${searchedPlano}%`,
                });
            }));
        }

        if (status) {
            query.andWhere("a.status = :status", { status });
            if (status == AssinaturasEnum.CANCELADA) {
                query.withDeleted();
            }
        }

        if (modalidade) {
            query.andWhere("a.modalidade = :modalidade", { modalidade });
        }


        const assinaturas = await query.getManyAndCount();
        return assinaturas;
    }

}

export { AssinaturasRepository };
