import { Injectable } from "@nestjs/common";
import { DataSource, Repository, ILike, Brackets } from "typeorm";
import { IArquivosGeraisRepository } from "../IArquivosGeraisRepository";
import { ArquivoGeral } from "../../entities/arquivo-geral.entity";

@Injectable()
export class ArquivosGeraisRepository extends Repository<ArquivoGeral> implements IArquivosGeraisRepository {

  constructor(private dataSource: DataSource) {
    super(ArquivoGeral, dataSource.createEntityManager());
  }
  async findById(id: string): Promise<ArquivoGeral> {
    const arquivoGeral = await this
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.user_registrou", "u_registrou")
      .where("a.id = :id", { id })
      .getOne();

    return arquivoGeral;
  }

}
