import { PageOptionsDto } from '../../../../../shared/dtos/page/page-options.dto';

import { Injectable } from "@nestjs/common";

import { DataSource, Repository, ILike, Brackets, In } from "typeorm";
import { CartaoCliente } from '../../entities/cartao-cliente.entity';
import { ICartaoClientesRepository } from '../ICartaoClientesRepository';
import { SearchCartaoClienteDto } from '../../dto/search-cartao-cliente.dto';

@Injectable()
class CartaoClientesRepository extends Repository<CartaoCliente> implements ICartaoClientesRepository {

    constructor(private dataSource: DataSource) {
        super(CartaoCliente, dataSource.createEntityManager());
    }

    async findById(id: string, canceled = false): Promise<CartaoCliente> {
        const query = this
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.cliente", "cliente")
            .innerJoinAndSelect("c.user_registrou", "user_registrou")
            .where("c.id = :id", { id });

        if (canceled) {
            query.withDeleted();
        }

        return await query.getOne();
    }

    async list(
        { skip, take, order }: PageOptionsDto,
        {
            status, tipo, cliente_id, user_registrou_id
        }: SearchCartaoClienteDto
    ): Promise<[CartaoCliente[], number]> {

        const query = this
            .createQueryBuilder("c")
            .innerJoinAndSelect("c.cliente", "cliente")
            .innerJoinAndSelect("c.user_registrou", "user_registrou")
            .orderBy("c.created_at", order)
            .skip(skip)
            .take(take)
            .where("1=1");

        if (cliente_id) {
            query.andWhere("cliente.id = :cliente_id", { cliente_id });
        }

        if (user_registrou_id) {
            query.andWhere("user_registrou.id = :user_registrou_id", { user_registrou_id });
        }

        if (status) {
            query.andWhere("c.status = :status", { status });
        }

        if (tipo) {
            query.andWhere("c.tipo = :tipo", { tipo });
        }


        const CartaoCliente = await query.getManyAndCount();
        return CartaoCliente;
    }

}

export { CartaoClientesRepository };
