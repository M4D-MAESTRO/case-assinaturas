
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { hash } from "bcrypt";

import { UsersService } from '../../users/users.service';
import { getUserIdService } from '../../../shared/utils/user-utils';
import { PageMetaDto } from '../../../shared/dtos/page/page-meta.dto';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../../shared/dtos/page/page.dto';
import { AppError } from '../../../errors/AppError';

import { CreateCartaoClienteDto } from './dto/create-cartao-cliente.dto';
import { CartaoClientesRepository } from './repositories/implementations/CartaoClientesRepository';
import { SearchCartaoClienteDto } from './dto/search-cartao-cliente.dto';
import { CartaoCliente } from './entities/cartao-cliente.entity';
import { StatusCartaoEnum } from './../../../shared/constants/cartao.constant';
import { SharedOperationsService } from './../../../shared/modules/shared-operations/shared-operations.service';


@Injectable({ scope: Scope.REQUEST })
export class CartaoClientesService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly cartaoClientesRepository: CartaoClientesRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SharedOperationsService))
    private readonly sharedOperationsService: SharedOperationsService,
  ) { }


  async pageAll(pageOptionsDto: PageOptionsDto, searchDto: SearchCartaoClienteDto) {
    const { cliente_id, user_registrou_id } = searchDto;

    if (!cliente_id && !user_registrou_id) {
      throw new AppError(`É necessário especificar o cliente, ou o último usuário que alterou o registro`);
    }

    const [cartoesCliente, total] = await this.cartaoClientesRepository.list(pageOptionsDto, searchDto);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(cartoesCliente, pageMetaDto);
  }

  async create(dto: CreateCartaoClienteDto) {
    const user_id = getUserIdService(this.request);
    const user_registrou = await this.usersService.findOne(user_id);
    const cliente = await this.usersService.findOne(dto.cliente_id);

    //Validacao do Cartao
    const { codigo_seguranca, numero_cartao, validade } = dto;
    const token_pagamento = await this.sharedOperationsService.validateCard({
      codigo_seguranca,
      numero_cartao,
      validade,
    });

    const cartaoCliente = this.cartaoClientesRepository.create(dto);
    cartaoCliente.user_registrou = user_registrou;
    cartaoCliente.cliente = cliente;
    cartaoCliente.status = StatusCartaoEnum.ATIVO;
    cartaoCliente.token_pagamento = token_pagamento;

    //a função slice() é usada com um índice negativo (-4), que começa a contar do final da string para pegar os 4 últimos dígitos.
    cartaoCliente.ultimos_digitos = cartaoCliente.numero_cartao.slice(-4);

    const saltRounds = 10; // Nível de segurança da criptografia
    // Geração do hash do número do cartão
    const hashedNumeroCartao = await hash(cartaoCliente.numero_cartao, saltRounds);
    cartaoCliente.numero_cartao = hashedNumeroCartao;

    const createdCartaoCliente = await this.cartaoClientesRepository.save(cartaoCliente);
    return plainToClass(CartaoCliente, createdCartaoCliente);
  }

  async findOne(id: string, showUserRegistrou = false) {
    const cartaoClienteExists = await this.checkIfCartaoClienteExists(id);
    if (showUserRegistrou) {
      return instanceToPlain(cartaoClienteExists, { groups: ['find'] }) as CartaoCliente;
    }
    return cartaoClienteExists;
  }

  async remove(id: string) {
    const cartaoCliente = await this.checkIfCartaoClienteExists(id);
    cartaoCliente.status = StatusCartaoEnum.INATIVO;
    cartaoCliente.token_pagamento = null;
    await this.cartaoClientesRepository.save(cartaoCliente);

    await this.cartaoClientesRepository.softDelete({ id });
  }


  private async checkIfCartaoClienteExists(id: string): Promise<CartaoCliente> {
    const cartaoClienteExists = await this.cartaoClientesRepository.findById(id);

    if (!cartaoClienteExists) {
      throw new AppError(`Cartão do cliente ${id} não encontrado!`, 404);
    }

    return cartaoClienteExists;
  }
}
