
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Patch } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CheckPolicies } from '../../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../../shared/authorizations/policies/policy.guard';
import { PageOptionsDto } from '../../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../../shared/dtos/page/page.dto';

import { CartaoClientesService } from './cartao-clientes.service';
import { CreateCartaoClienteDto } from './dto/create-cartao-cliente.dto';
import { CartaoCliente } from './entities/cartao-cliente.entity';
import { SearchCartaoClienteDto } from './dto/search-cartao-cliente.dto';

@ApiBearerAuth()
@ApiTags('Cartão Clientes')
@Controller('cartao-clientes')
export class CartaoClientesController {
  constructor(private readonly cartaoClientesService: CartaoClientesService) { }


  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CartaoCliente))
  @ApiOperation({
    summary: 'Cadastra um novo cartão para o cliente',
  })
  @ApiResponse({ status: 200, isArray: false, type: CartaoCliente })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createCartaoClienteDto: CreateCartaoClienteDto) {
    return this.cartaoClientesService.create(createCartaoClienteDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CartaoCliente))
  @ApiOperation({
    summary: 'Lista todos os cartões de um cliente X',
  })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findAll(@Query() pageOptions: PageOptionsDto, @Query() searchDto: SearchCartaoClienteDto) {
    return this.cartaoClientesService.pageAll(pageOptions, searchDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CartaoCliente))
  @ApiOperation({ summary: 'Recupera o cartão de um cliente com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: CartaoCliente })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.cartaoClientesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CartaoCliente))
  @ApiOperation({ summary: 'Deleta o cartão de um cliente' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.cartaoClientesService.remove(id);
  }
}
