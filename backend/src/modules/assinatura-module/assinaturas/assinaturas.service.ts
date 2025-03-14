import { FormaPagamentosService } from './../../adm-pagamentos/forma-pagamentos/forma-pagamentos.service';


import { ClassSerializerInterceptor, forwardRef, Inject, Injectable, Scope, UseInterceptors } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { In } from 'typeorm';
import { instanceToPlain, plainToClass, serialize } from 'class-transformer';
import { add, addDays, addMonths } from 'date-fns';

import { UsersService } from '../../users/users.service';
import { getUserIdService } from '../../../shared/utils/user-utils';
import { PageMetaDto } from '../../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../../shared/dtos/page/page.dto';
import { AppError } from '../../../errors/AppError';

import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { Assinatura } from './entities/assinatura.entity';
import { AssinaturasRepository } from './repositories/implementations/AssinaturasRepository';
import { SharedService } from './../../../shared/modules/shared.service';
import { SearchAssinaturaDto } from './dto/search-assinatura.dto';
import { AssinaturasEnum } from './../../../shared/constants/status-assinaturas.constant';
import { ModalidadesAssinaturaEnum } from './../../../shared/constants/modalidade-assinaturas.const';

@Injectable({ scope: Scope.REQUEST })
export class AssinaturasService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly assinaturasRepository: AssinaturasRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SharedService))
    private readonly sharedService: SharedService,
    @Inject(forwardRef(() => FormaPagamentosService))
    private readonly formaPagamentosService: FormaPagamentosService,
  ) { }


  async pageAll(pageOptionsDto: PageOptionsDto, searchDto: SearchAssinaturaDto) {
    const [planos, total] = await this.assinaturasRepository.list(pageOptionsDto, searchDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(planos, pageMetaDto);
  }

  async create(dto: CreateAssinaturaDto) {
    const user_id = getUserIdService(this.request);
    const user_registrou = await this.usersService.findOne(user_id);
    const assinatura = this.assinaturasRepository.create(dto);

    const plano = await this.sharedService.findOnePlano(dto.plano_assinatura_id);
    const assinante = await this.usersService.findOne(dto.assinante_id);

    const assinaturaAlreadyExists = await this.assinaturasRepository.findByUserIdAndPlanoId(assinante.id, plano.id);

    if (assinaturaAlreadyExists) {
      throw new AppError(`'${assinante.nome}' já assina o plano '${plano.nome}' na modalidade '${assinaturaAlreadyExists.modalidade}'`);
    }

    const forma_pagamento = await this.formaPagamentosService.create(dto.forma_pagamento, assinante.id);

    const created_date = new Date();
    assinatura.user_registrou = user_registrou;
    assinatura.assinante = assinante;
    assinatura.plano_assinatura = plano;
    assinatura.created_at = created_date;
    assinatura.data_inicio = created_date;
    assinatura.forma_pagamento = forma_pagamento;

    assinatura.data_fim = this.generateDataFim(assinatura);

    assinatura.status = AssinaturasEnum.ATIVO;

    const createdAssinatura = await this.assinaturasRepository.save(assinatura);

    return plainToClass(Assinatura, createdAssinatura);
  }

  async findOne(id: string, showUserRegistrou = false) {
    const assinaturaExists = await this.checkIfAssinaturaExists(id);
    if (showUserRegistrou) {
      return instanceToPlain(assinaturaExists, { groups: ['find'] }) as Assinatura;
    }
    return assinaturaExists;
  }

  async update(id: string, dto: UpdateAssinaturaDto) {
    const { modalidade: current_modalidade, data_inicio, forma_pagamento, assinante } = await this.checkIfAssinaturaExists(id);
    const user_id = getUserIdService(this.request);
    const user = await this.usersService.findOne(user_id);
    const assinatura = this.assinaturasRepository.create(dto);
    assinatura.user_registrou = user;

    if (dto.plano_assinatura_id) {
      const plano = await this.sharedService.findOnePlano(dto.plano_assinatura_id);
      assinatura.plano_assinatura = plano;
    }
    if (dto.modalidade != current_modalidade) {
      assinatura.data_inicio = data_inicio;
      assinatura.data_fim = this.generateDataFim(assinatura);
    }
    if (dto.forma_pagamento.tipo != forma_pagamento.tipo) {
      const updated_forma_pagamento = await this.formaPagamentosService.create(dto.forma_pagamento, assinante.id);
      assinatura.forma_pagamento = updated_forma_pagamento;
    }

    
    const updatedAssinatura = await this.assinaturasRepository.save(assinatura);
    return plainToClass(Assinatura, updatedAssinatura);
  }

  async inativar(id: string) {
    const user_id = getUserIdService(this.request);
    const user_registrou = await this.usersService.findOne(user_id);

    const assinatura = await this.checkIfAssinaturaExists(id);
    assinatura.user_registrou = user_registrou;
    assinatura.status = AssinaturasEnum.CANCELADA
    assinatura.data_fim = new Date();
    assinatura.deleted_at = assinatura.data_fim;
    await this.assinaturasRepository.save(assinatura);
    await this.assinaturasRepository.softDelete({ id });
  }

  async ativar(id: string) {
    const user_id = getUserIdService(this.request);
    const user_registrou = await this.usersService.findOne(user_id);

    const assinatura = await this.checkIfAssinaturaExists(id);

    const created_date = new Date();
    assinatura.user_registrou = user_registrou;
    assinatura.created_at = created_date;
    assinatura.data_inicio = created_date;
    assinatura.status = AssinaturasEnum.ATIVO;

    assinatura.data_fim = this.generateDataFim(assinatura);
    await this.assinaturasRepository.save(assinatura);
  }

  async pendenteDePagamento(id: string) {
    const assinatura = await this.checkIfAssinaturaExists(id);
    assinatura.status = AssinaturasEnum.PENDENTE
    await this.assinaturasRepository.save(assinatura);
  }

  async pausar(id: string) {
    const assinatura = await this.checkIfAssinaturaExists(id);
    assinatura.status = AssinaturasEnum.PAUSADO
    await this.assinaturasRepository.save(assinatura);
  }

  private generateDataFim({ data_inicio, modalidade }: Assinatura): Date {

    switch (modalidade) {
      case ModalidadesAssinaturaEnum.MENSAL:
        return addDays(addMonths(data_inicio, 1), 1);

      case ModalidadesAssinaturaEnum.TRIMESTRAL:
        return addDays(addMonths(data_inicio, 3), 1);

      case ModalidadesAssinaturaEnum.SEMESTRAL:
        return addDays(addMonths(data_inicio, 6), 1);

      case ModalidadesAssinaturaEnum.ANUAL:
        return add(data_inicio, { years: 1, days: 1 });

      default:
        throw new AppError(`Modalidade de assinatura ${modalidade} inválida!`);

    }
  }

  private async checkIfAssinaturaExists(id: string): Promise<Assinatura> {
    const assinaturaExists = await this.assinaturasRepository.findById(id);

    if (!assinaturaExists) {
      throw new AppError(`Assinatura ${id} não encontrado!`, 404);
    }

    return assinaturaExists;
  }
}
