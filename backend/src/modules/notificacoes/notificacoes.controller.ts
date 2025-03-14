import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacoeDto } from './dto/create-notificacoe.dto';
import { UpdateNotificacoeDto } from './dto/update-notificacoe.dto';
import { Notificacao } from './entities/notificacoe.entity';

@Controller('notificacoes')
@ApiTags('Notificações')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) { }

  @Get()
  // @UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Beneficio))
  @ApiOperation({ summary: 'Lista todos as notificações do usuário autenticado' })
  @ApiResponse({ status: 200, isArray: true, type: Notificacao })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async pageSelf() {
    return await this.notificacoesService.listByLoggedUser();
  }

  @Get(':id')
  // @UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Beneficio))
  @ApiOperation({ summary: 'Lista todos as notificações de um usuário' })
  @ApiResponse({ status: 200, isArray: true, type: Notificacao })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async pageAll(@Param('id') id: string) {
    return await this.notificacoesService.listByUserId(id);
  }
  // terminar de testar o recurso e implementar no front
  @Patch(':id/read')
  // @UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Beneficio))
  @ApiOperation({ summary: 'Marca uma notificação como lida' })
  @ApiResponse({ status: 200, isArray: true, type: Notificacao })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async markAsRead(@Param('id') id: string) {
    return await this.notificacoesService.markAsRead(id);
  }

  @Patch(':id/unread')
  // @UseGuards(PoliciesGuard)
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Beneficio))
  @ApiOperation({ summary: 'Marca uma notificação como não lida' })
  @ApiResponse({ status: 200, isArray: true, type: Notificacao })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  async markAsUnread(@Param('id') id: string) {
    return await this.notificacoesService.markAsUnread(id);
  }

}
