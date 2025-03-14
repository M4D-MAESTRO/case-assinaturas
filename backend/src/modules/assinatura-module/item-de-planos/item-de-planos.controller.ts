import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';

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

import { ItemDePlanosService } from './item-de-planos.service';
import { CreateItemDePlanoDto } from './dto/create-item-de-plano.dto';
import { UpdateItemDePlanoDto } from './dto/update-item-de-plano.dto';
import { ItemDePlano } from './entities/item-de-plano.entity';
import { SearchItemDePlanoDto } from './dto/search-item-de-plano.dto';

@ApiBearerAuth()
@ApiTags('Item de Planos')
@Controller('item-de-planos')
export class ItemDePlanosController {

  constructor(private readonly itemDePlanosService: ItemDePlanosService) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, ItemDePlano))
  @ApiOperation({
    summary: 'Cria um novo item de plano',
    description: `Um item de plano, é um item que pode ser associado a um plano de assinatura`
  })
  @ApiResponse({ status: 200, isArray: false, type: ItemDePlano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createItemDePlanoDto: CreateItemDePlanoDto) {
    return this.itemDePlanosService.create(createItemDePlanoDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ItemDePlano))
  @ApiOperation({
    summary: 'Lista todos os itens de plano já criado',
    description: 'Possibilita o re-uso de itens de planos já criados, onde o mesmo item pode ser usado em diversos planos'
  })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findAll(@Query() pageOptions: PageOptionsDto, @Query() searchDto: SearchItemDePlanoDto) {
    return this.itemDePlanosService.pageAll(pageOptions, searchDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ItemDePlano))
  @ApiOperation({ summary: 'Recupera um item de plano com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: ItemDePlano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.itemDePlanosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, ItemDePlano))
  @ApiOperation({ summary: 'Atualiza um item de plano' })
  @ApiResponse({ status: 200, isArray: false, type: ItemDePlano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id',) id: string, @Body() dto: UpdateItemDePlanoDto) {
    return this.itemDePlanosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, ItemDePlano))
  @ApiOperation({ summary: 'Deleta um item de plano, contanto que ele não esteja sendo usado (associado) a um plano' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.itemDePlanosService.remove(id);
  }
}
