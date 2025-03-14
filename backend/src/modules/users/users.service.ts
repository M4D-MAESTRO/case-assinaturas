
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { hash } from "bcrypt";

import { User } from './entities/user.entity';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/implementations/UsersRepository';

import { PageMetaDto } from '../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';
import { AppError } from '../../errors/AppError';
import { getStatusUsuarioByCod, StatusUsuarioEnum } from '../../shared/constants/status-usuario.constant';
import { Endereco } from '../enderecos/entities/endereco.entity';
import { CreateEnderecoDto } from '../enderecos/dto/create-endereco.dto';
import { SharedService } from '../../shared/modules/shared.service';
import { getUserIdService } from '../../shared/utils/user-utils';
import { SendMailProducerService } from '../../jobs/email/send-mail-job/sendMail-procucer.service';
import { FolderPathEnum } from '../../shared/constants/folder-path.constant';
import { SearchUserDto } from './dto/search-user.dto';
import { DefaultValuesUtils } from '../../shared/utils/defaultValuesUtils';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(Endereco)
    private readonly enderecosRepository: Repository<Endereco>,
    private readonly usersRepository: UsersRepository,
    private readonly sharedService: SharedService,
    private readonly sendMailProducerService: SendMailProducerService,

  ) { }

  async create(dto: CreateUserDto) {
    let user = this.usersRepository.create(dto);
    user.status = StatusUsuarioEnum.ATIVO;
    user.senha = await hash(user.senha, 8);
    user = await this.complementaInformacoes(user, dto);

    const createdUser = await this.usersRepository.save(user) as User;

    const { nome, email } = createdUser;

    this.sendMailProducerService.sendRegisterMail({
      email,
      nome,
      senha: dto.senha,
    });

    return createdUser;
  }

  async createSuperAdmin(dto: CreateUserDto) {
    const superAdmin = await this.usersRepository.createSuperAdmin(dto);

    return superAdmin;
  }

  async findAll(search: SearchUserDto, pageOptionsDto: PageOptionsDto) {
    const [perfis, total] = await this.usersRepository.listAllUsers(search, pageOptionsDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(perfis, pageMetaDto);
  }

  async findOne(id: string) {
    const userExists = await this.checkIfUserExists(id);
    return userExists;
  }

  async listUsersByRoleName(roleName: string) {
    const usersList = await this.usersRepository.listUsersByRoleName(roleName);
    return usersList;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    let user = await this.checkIfUserExists(id);
    user = await this.complementaInformacoesUpdate(user, dto);

    const updatedUser = await this.usersRepository.save(user) as User;
    return updatedUser;
  }

  async updatePassword(dto: UpdateUserPasswordDto) {
    const user_id = getUserIdService(this.request);

    if (!user_id) {
      throw new AppError(`ID do usuário logado não foi identificado`, 500);
    }

    const user = await this.checkIfUserExists(user_id);
    user.senha = await hash(dto.senha, 8);
    await this.usersRepository.save(user);
  }

  async createUserEndereco(id: string, dto: CreateEnderecoDto) {
    const endereco = this.enderecosRepository.create(dto);
    const user = await this.checkIfUserExists(id);

    if (user.endereco) {
      const { id } = user.endereco;
      await this.enderecosRepository.delete({ id });
    }

    user.endereco = endereco;
    return await this.usersRepository.save(user) as User;
  }

  async remove(id: string) {
    await this.checkIfUserExists(id);

    await this.usersRepository.softDelete({ id });
  }

  async patchUser(user: User) {
    const updatedUser = await this.usersRepository.save(user) as User;
    return updatedUser;
  }

  async updateAvatar(file: Express.Multer.File,) {
    const folder = FolderPathEnum.USER_AVATAR;
    const user_id = getUserIdService(this.request);

    if (!user_id) {
      throw new AppError(`ID do usuário logado não foi identificado`, 500);
    }

    const { bucket, provedor } = process.env.MODE == 'DEV' ?
      DefaultValuesUtils.getDevelopmentProviderAndBucket() :
      DefaultValuesUtils.getProductionProviderAndBucket();

    const user = await this.checkIfUserExists(user_id);
    if (user.avatar) {
      await this.sharedService.deleteFile({
        folder,
        file_name: user.avatar,
        user,
        bucket,
        provedor,
      });
    }

    const avatarUrl = await this.sharedService.uploadFile({
      folder,
      file,
      user,
      bucket,
      provedor,
    });

    user.avatar = avatarUrl;
    return await this.patchUser(user);
  }

  private async checkIfUserExists(id: string): Promise<User> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError(`Usuário ${id} não encontrado!`, 404);
    }

    return userExists;
  }

  private async complementaInformacoes(user: User, dto: CreateUserDto | UpdateUserDto) {
    const { perfil_id } = dto;


    if (perfil_id) {
      const perfil = await this.sharedService.findOnePerfil(perfil_id);
      user.perfil = perfil || undefined;
    }

    return user;

  }

  private async complementaInformacoesUpdate(user: User, dto: UpdateUserDto) {
    user = await this.complementaInformacoes(user, dto);

    user.nome = dto.nome || user.nome;
    user.status = dto.status || user.status;
    user.email = dto.email || user.email;
    user.avatar = dto.avatar || user.avatar;

    return user;

  }

}
