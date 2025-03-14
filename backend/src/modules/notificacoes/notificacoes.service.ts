import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { Notificacao } from './entities/notificacoe.entity';
import { AppError } from '../../errors/AppError';
import { getUserIdService } from '../../shared/utils/user-utils';

@Injectable({ scope: Scope.REQUEST })
export class NotificacoesService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(Notificacao)
    private readonly notificacaoRepository: Repository<Notificacao>,
  ) { }

  async create(createNotificacoeDto: CreateNotificacoeDto) {
    const notificacao = this.notificacaoRepository.create(createNotificacoeDto);
    notificacao.is_read = false;
    return await this.notificacaoRepository.save(notificacao);
  }

  async listByLoggedUser() {
    const user_id = getUserIdService(this.request);

    if (!user_id) {
      throw new AppError(`ID do usuário logado não foi identificado`, 500);
    }

    const notificacoes = await this.notificacaoRepository
      .createQueryBuilder('n')
      .leftJoin('n.requester_user', 'u')
      .where('u.id = :id', { id: user_id })
      .orderBy('n.created_at', "DESC")
      .take(20)
      .getMany();

    return notificacoes;
  }

  async listByUserId(user_id: string) {
    const notificacoes = await this.notificacaoRepository
      .createQueryBuilder('n')
      .leftJoin('n.requester_user', 'u')
      .where('u.id = :id', { id: user_id })
      .orderBy('n.created_at', "DESC")
      .take(20)
      .getMany();

    return notificacoes;
  }

  async markAsRead(id: string) {
    const notificacao = await this.checkIfNotificacaoExists(id);
    notificacao.is_read = true;

    return await this.notificacaoRepository.save(notificacao);
  }

  async markAsUnread(id: string) {
    const notificacao = await this.checkIfNotificacaoExists(id);
    notificacao.is_read = false;

    return await this.notificacaoRepository.save(notificacao);
  }

  private async checkIfNotificacaoExists(id: string): Promise<Notificacao> {
    const notificacaoExists = await this.notificacaoRepository.findOne({ where: { id } });

    if (!notificacaoExists) {
      throw new AppError(`Notificação ${id} não encontrado!`, 404);
    }

    return notificacaoExists;
  }

}
