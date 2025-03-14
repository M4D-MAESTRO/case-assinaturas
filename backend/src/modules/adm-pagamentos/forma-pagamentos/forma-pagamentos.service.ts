
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { UsersService } from '../../users/users.service';
import { getUserIdService } from '../../../shared/utils/user-utils';
import { AppError } from '../../../errors/AppError';

import { CreateFormaPagamentoDto } from './dto/create-forma-pagamento.dto';
import { UpdateFormaPagamentoDto } from './dto/update-forma-pagamento.dto';
import { FormaPagamentosRepository } from './repositories/implementations/FormaPagamentosRepository';
import { CartaoClientesService } from '../cartao-clientes/cartao-clientes.service';
import { FormaPagamento } from './entities/forma-pagamento.entity';
import { PagamentoFormasEnum } from './../../../shared/constants/pagamento-formas.constant';

@Injectable({ scope: Scope.REQUEST })
export class FormaPagamentosService {

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly formaPagamentosRepository: FormaPagamentosRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CartaoClientesService))
    private readonly cartaoClientesService: CartaoClientesService,
  ) { }

  async create(dto: CreateFormaPagamentoDto, user_responsavel_cartao_id: string) {
    const user_id = getUserIdService(this.request);
    const user_registrou = await this.usersService.findOne(user_id);
    const formaPagamento = this.formaPagamentosRepository.create(dto);
    formaPagamento.user_registrou = user_registrou;

    this.checkPreenchimentoCartao(dto);
    if (dto.tipo == PagamentoFormasEnum.CARTAO_CREDITO || dto.tipo == PagamentoFormasEnum.CARTAO_DEBITO) {
      const cartao_cliente = await this.cartaoClientesService.findOne(dto.cartao_cliente_id);
      if(cartao_cliente.cliente.id != user_responsavel_cartao_id){
        throw new AppError(`Cartão não cadastrado para o usuário ${cartao_cliente.cliente.nome}`);
      }
      formaPagamento.cartao_cliente = cartao_cliente;
    }

    const createdFormaPagamento = await this.formaPagamentosRepository.save(formaPagamento);
    return plainToClass(FormaPagamento, createdFormaPagamento);
  }

  async update(id: string, dto: UpdateFormaPagamentoDto) {
    const formaPagamento = await this.checkIfFormaPagamentoExists(id);
    await this.checkTipoChanged(formaPagamento, dto);
    this.checkPreenchimentoCartao(dto);

    const updatedFormaPagamento = await this.formaPagamentosRepository.save(dto);

    return plainToClass(FormaPagamento, updatedFormaPagamento);
  }

  async findOne(id: string, showUserRegistrou = false) {
    const formaPagamentoExists = await this.checkIfFormaPagamentoExists(id);
    if (showUserRegistrou) {
      return instanceToPlain(formaPagamentoExists, { groups: ['find'] }) as FormaPagamento;
    }
    return formaPagamentoExists;
  }

  async remove(id: string) {
    await this.checkIfFormaPagamentoExists(id);
    await this.formaPagamentosRepository.softDelete({ id });
  }

  private async checkTipoChanged(
    currentFormaPagamento: FormaPagamento,
    newFormaPagamento: CreateFormaPagamentoDto | UpdateFormaPagamentoDto
  ) {
    if (newFormaPagamento.tipo && (currentFormaPagamento.tipo != newFormaPagamento.tipo)) {
      currentFormaPagamento.cartao_cliente = null;
      await this.formaPagamentosRepository.save(currentFormaPagamento);
    }
  }

  private checkPreenchimentoCartao({ tipo, cartao_cliente_id }: CreateFormaPagamentoDto | UpdateFormaPagamentoDto) {
    if (
      (tipo == PagamentoFormasEnum.CARTAO_CREDITO || tipo == PagamentoFormasEnum.CARTAO_DEBITO) &&
      !cartao_cliente_id
    ) {
      throw new AppError(`É necessário associar o cartão do cliente quanto o tipo de pagamento for 
      ${PagamentoFormasEnum.CARTAO_CREDITO} ou ${PagamentoFormasEnum.CARTAO_DEBITO}`);
    }

  }

  private async checkIfFormaPagamentoExists(id: string): Promise<FormaPagamento> {
    const formaPagamentoExists = await this.formaPagamentosRepository.findById(id);

    if (!formaPagamentoExists) {
      throw new AppError(`Forma de pagamento ${id} não encontrada!`, 404);
    }

    return formaPagamentoExists;
  }
}
