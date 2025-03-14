import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PerfisService } from './perfis.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Perfil } from './entities/perfil.entity';
import { PageOptionsDto } from '../../shared/dtos/page/page-options.dto';
import { PageDto } from '../../shared/dtos/page/page.dto';

import { CheckPolicies } from '../../shared/authorizations/policies/check-policies.const';
import { Action } from '../../shared/authorizations/enums/action.enum';
import { AppAbility } from '../../shared/authorizations/casl/casl-ability.factory';
import { PoliciesGuard } from '../../shared/authorizations/policies/policy.guard';

@ApiBearerAuth()
@ApiTags('Perfis')
@Controller('perfis')
export class PerfisController {
  constructor(
    private readonly perfisService: PerfisService,
  ) { }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Perfil))
  @ApiOperation({ summary: 'Cria um novo perfil' })
  @ApiResponse({ status: 200, isArray: false, type: Perfil })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async create(@Body() dto: CreatePerfilDto) {
    return await this.perfisService.create(dto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Perfil))
  @ApiOperation({ summary: 'Lista todos os perfis ativos' })
  @ApiResponse({ status: 200, isArray: true, type: PageDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async findAll(@Query() dto: PageOptionsDto) {
    return await this.perfisService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Perfil))
  @ApiOperation({ summary: 'Recupera um perfil com base no ID passado' })
  @ApiResponse({ status: 200, isArray: false, type: Perfil })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  findOne(@Param('id') id: string) {
    return this.perfisService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Perfil))
  @ApiOperation({ summary: 'Atualiza um perfil' })
  @ApiResponse({ status: 200, isArray: false, type: Perfil })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiParam({ name: 'id', required: true, type: String })
  update(@Param('id') id: string, @Body() dto: UpdatePerfilDto) {
    return this.perfisService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Perfil))
  @ApiOperation({ summary: 'Deleta um perfil' })
  @ApiResponse({ status: 204, })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  remove(@Param('id') id: string) {
    return this.perfisService.remove(id);
  }
}
