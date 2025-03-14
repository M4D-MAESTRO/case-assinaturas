
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";

import { BasicCargaNotificationDto } from './dto/carga-notification.dto';
import { NotificacaoTipoEnum } from '../../../shared/constants/notificacao-tipo.dto';
import { SharedService } from '../../../shared/modules/shared.service';
import { NotificacaoStatus } from '../../../shared/constants/notificacao-status.constant';

@WebSocketGateway({ cors: true })
export class CargaDadosSocketGateway {

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger(CargaDadosSocketGateway.name);

  constructor(
    private readonly sharedService: SharedService,
  ) { }

  cargaNotification(notification: BasicCargaNotificationDto) {
    const { user, carga_nome, job_id, message, status } = notification;
    this.server.to(user.socket_id)
      .emit('carga_started', { carga_nome, job_id, message, status });

    this.sharedService.createNewNotification({
      descricao: message,
      nome: `${carga_nome} - ${job_id}`,
      status: NotificacaoStatus.INFO,
      tipo: NotificacaoTipoEnum.CARGA,
      requester_user: user,
    });
  }

  finishNotification(notification: BasicCargaNotificationDto) {
    const { user, carga_nome, job_id, message, status } = notification;
    this.server.to(user.socket_id)
      .emit('carga_end', { carga_nome, job_id, message, status });

    const statusNotificacao = status == STATUSES.completed ? NotificacaoStatus.SUCESSO : NotificacaoStatus.ERRO
    this.sharedService.createNewNotification({
      descricao: message,
      nome: `${carga_nome} - ${job_id}`,
      status: statusNotificacao,
      tipo: NotificacaoTipoEnum.CARGA,
      requester_user: user,
    });
  }

}
