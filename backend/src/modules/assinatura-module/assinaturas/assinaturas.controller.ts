import { SearchAssinaturaDto } from './dto/search-assinatura.dto';
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

import { AssinaturasService } from './assinaturas.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { Assinatura } from './entities/assinatura.entity';

@ApiBearerAuth()
@ApiTags('Assinaturas')
@Controller('assinaturas')
export class AssinaturasController {

  constructor(private readonly assinaturasService: AssinaturasService) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Assinatura))
  @ApiOperation({
    summary: 'Cria uma nova assinatura',
  })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturasService.create(createAssinaturaDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Assinatura))
  @ApiOperation({
    summary: 'Lista todas as assinaturas vigentes',
    description: 'Possibilita listar todas as assinaturas vigentes, mas caso queria as inativas, o mesmo deve ser especificado no campo "status"'
  })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findAll(@Query() pageOptions: PageOptionsDto, @Query() searchDto: SearchAssinaturaDto) {
    return this.assinaturasService.pageAll(pageOptions, searchDto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Assinatura))
  @ApiOperation({ summary: 'Recupera uma assinatura com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.assinaturasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Assinatura))
  @ApiOperation({ summary: 'Atualiza uma assinatura' })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id') id: string, @Body() updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.assinaturasService.update(id, updateAssinaturaDto);
  }

  @Patch(':id/ativo')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Assinatura))
  @ApiOperation({ summary: 'Coloca uma assinatura como "Pendente de Pagamento"' })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  ativar(@Param('id') id: string) {
    return this.assinaturasService.ativar(id);
  }

  @Patch(':id/pendente')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Assinatura))
  @ApiOperation({ summary: 'Coloca uma assinatura como "Pendente de Pagamento"' })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  pendenteDePagamento(@Param('id') id: string) {
    return this.assinaturasService.pendenteDePagamento(id);
  }

  @Patch(':id/pausada')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Assinatura))
  @ApiOperation({ summary: 'Coloca uma assinatura como "PAUSADA"' })
  @ApiResponse({ status: 200, isArray: false, type: Assinatura })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  pausar(@Param('id') id: string) {
    return this.assinaturasService.pausar(id);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Assinatura))
  @ApiOperation({ summary: 'Deleta um assinatura' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.assinaturasService.inativar(id);
  }
}
