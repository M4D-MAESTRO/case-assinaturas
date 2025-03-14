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

import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { Plano } from './entities/plano.entity';
import { SearchPlanoDto } from './dto/search-plano.dto';
import { AssociarItemPlanoDto } from './dto/associar-itens-plano.dto';
import { DesassociarItemPlanoDto } from './dto/desassociar-itens-plano.dto';

@ApiBearerAuth()
@ApiTags('Planos')
@Controller('planos')
export class PlanosController {

  constructor(private readonly planosService: PlanosService) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Plano))
  @ApiOperation({
    summary: 'Cria um novo plano',
    description: `Um plano pode ser associado a um plano de assinatura de um usuário`
  })
  @ApiResponse({ status: 200, isArray: false, type: Plano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Plano))
  @ApiOperation({
    summary: 'Lista todos os itens de plano já criado',
    description: 'Possibilita o re-uso de itens de planos já criados, onde o mesmo item pode ser usado em diversos planos'
  })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findAll(@Query() pageOptions: PageOptionsDto, @Query() searchDto: SearchPlanoDto) {
    return this.planosService.pageAll(pageOptions, searchDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Plano))
  @ApiOperation({ summary: 'Recupera um plano com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Plano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.planosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Plano))
  @ApiOperation({ summary: 'Atualiza um plano' })
  @ApiResponse({ status: 200, isArray: false, type: Plano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(id, updatePlanoDto);
  }

  @Patch(':id/associar')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Plano))
  @ApiOperation({ summary: 'Associa itens a um plano' })
  @ApiResponse({ status: 200, isArray: false, type: Plano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  associar(@Param('id') id: string, @Body() dto: AssociarItemPlanoDto) {
    return this.planosService.associar(id, dto);
  }

  @Patch(':id/desassociar')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Plano))
  @ApiOperation({ summary: 'Associa itens a um plano' })
  @ApiResponse({ status: 200, isArray: false, type: Plano })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  desassociar(@Param('id') id: string, @Body() dto: DesassociarItemPlanoDto) {
    return this.planosService.desassociar(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Plano))
  @ApiOperation({ summary: 'Deleta um plano, contanto que ele não esteja sendo usado (associado) a um plano' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.planosService.remove(id);
  }
}
