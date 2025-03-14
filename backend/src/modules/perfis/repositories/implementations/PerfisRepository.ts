import { Injectable } from "@nestjs/common";
import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { DataSource, Repository } from "typeorm";
import { Perfil } from "../../entities/perfil.entity";
import { IPerfisRepository } from "../IPerfisRepository";

@Injectable()
class PerfisRepository extends Repository<Perfil> implements IPerfisRepository {

  constructor(private dataSource: DataSource) {
    super(Perfil, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Perfil> {
    const perfil = await this
      .createQueryBuilder("perfil")
      .where("perfil.id = :id", { id })
      .getOne();
    return perfil;
  }

  async list({ skip, take, order }: PageOptionsDto): Promise<[Perfil[], number]> {
    const perfis = await this
      .createQueryBuilder("perfil")
      .orderBy("perfil.created_at", order)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return perfis;
  }

  async findByNome(nome: string): Promise<Perfil> {
    const perfil = await this.findOne({ where: { nome } });
    return perfil;
  }

  async getAllAuthorizationsByUser(user_id: string): Promise<[string, string]> {
    const autorizacao = await this.query(`
    select p.nome, u.status from users u 
    join perfis p 
    on u.perfil_id = p.id 
    where u.id = '${user_id}'
    `);

    const { nome: perfil_nome, status } = autorizacao[0];

    return [perfil_nome, status];
  }
}

export { PerfisRepository };
