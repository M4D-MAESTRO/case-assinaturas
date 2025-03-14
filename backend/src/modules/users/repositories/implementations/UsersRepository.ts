import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";

import { PageOptionsDto } from "../../../../shared/dtos/page/page-options.dto";
import { AppError } from "../../../../errors/AppError";
import { CreateUserDto } from "../../dto/create-user.dto";
import { FilterUserDto } from "../../dto/filter-user.dto";
import { User } from "../../entities/user.entity";
import { IUsersRepository } from "../IUsersRepository";
import { SearchUserDto } from "../../dto/search-user.dto";
import { client_pefil_id, system_users_id } from "../../../../shared/constants/system.constant";
import { TipoUsuarioEnum } from "../../../../shared/constants/status-usuario.constant";
import { cliente_nao_cadastrado_id } from "../../../../shared/constants/system.constant";

@Injectable()
class UsersRepository extends Repository<User> implements IUsersRepository {

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async listAllUsers(
    {  nome, email, cpf, searchedUser, status, tipo_usuario, load_cliente_nao_identificado }: SearchUserDto,
    { skip, take, order }: PageOptionsDto,
    filter?: FilterUserDto
  ): Promise<[User[], number]> {

    const query = this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("u.id NOT IN (:...system_users_id)")
      .setParameter('system_users_id', [...system_users_id]);

    if (filter && filter.perfil_nomes) {
      query.andWhere("perfil.nome IN (:...nome)")
        .setParameter('nome', [...filter.perfil_nomes]);
    }

    if (searchedUser) {
      query.andWhere(new Brackets(qb => {
        qb.where("u.nome ILIKE :nome OR u.email ILIKE :email OR u.cpf ILIKE :cpf", {
          nome: `%${searchedUser}%`,
          email: `%${searchedUser}%`,
          cpf: `%${searchedUser}%`
        });
      }));
    }

    if (status) {
      query.andWhere(new Brackets(qb => {
        qb.where("u.status = :status", { status });
      }));
    }


    if (nome) {
      query.andWhere("u.nome = :nome", { nome });
    }

    if (email) {
      query.andWhere("u.email = :email", { email });
    }

    if (cpf) {
      query.andWhere("u.cpf = :cpf", { cpf });
    }

    if (tipo_usuario == TipoUsuarioEnum.CLIENTE) {
      query.andWhere("perfil.id = :perfil_id", { perfil_id: client_pefil_id });
      if (load_cliente_nao_identificado) {
        query.andWhere("u.id NOT IN (:cliente_nao_cadastrado_id)", { cliente_nao_cadastrado_id });
      }
    } else {
      query.andWhere("perfil.id != :perfil_id", { perfil_id: client_pefil_id });

    }

    const users = await query
      .orderBy("u.created_at", order)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return users;
  }

  async listUsersByRoleName(roleName: string): Promise<User[]> {
    const users = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("perfil.nome = :nome", { nome: roleName })
      .andWhere("u.id NOT IN (:...system_users_id)")
      .setParameter('system_users_id', [...system_users_id])
      .getMany();
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("u.id = :id", { id })
      .getOne();
    return user;
  }

  async findBySocketId(socket_id: string): Promise<User> {
    const user = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("u.socket_id = :socket_id", { socket_id })
      .getOne();
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("u.email = :email", { email })
      .getOne();
    return user;
  }

  async findByCpf(cpf: string): Promise<User> {
    const user = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .leftJoinAndSelect("u.endereco", "endereco")
      .where("u.cpf = :cpf", { cpf })
      .getOne();
    return user;
  }

  async findByEmailOrCpf(email: string, cpf: string): Promise<User> {
    const user = await this
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.perfil", "perfil")
      .where("u.email = :email OR u.cpf = :cpf", { email, cpf })
      .getOne();
    return user;
  }


  async patchCurrentSocket(socket_id: string, user_id: string): Promise<void> {
    const id = user_id;
    const user = await this.findOne({ where: { id } });

    if (!user) {
      throw new AppError(`Usuário de ID ${id} não encontrado`);
    }

    user.socket_id = socket_id;

    await this.save(user);
  }

  async createSuperAdmin({
    email,
    senha,
    cpf,
    nome,
  }: CreateUserDto): Promise<User> {
    const user = this.create({
      email,
      senha,
      cpf,
      status: "ATIVO",
      is_admin: true,
      nome,
    });
    const createdUser = await this.save(user);

    return createdUser;
  }

}

export { UsersRepository };
