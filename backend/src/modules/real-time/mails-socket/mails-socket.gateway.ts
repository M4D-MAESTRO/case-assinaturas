import { EmailTypeEnum } from './../../../shared/constants/email-type.constant';

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { STATUSES } from "@bull-board/api/dist/src/constants/statuses";

import { NotificacaoTipoEnum } from '../../../shared/constants/notificacao-tipo.dto';
import { SharedService } from '../../../shared/modules/shared.service';
import { NotificacaoStatus } from '../../../shared/constants/notificacao-status.constant';
import { EmailNotificationDto } from './dto/email-notification.dto';

@WebSocketGateway({ cors: true })
export class MailsSocketGateway {
  
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger(MailsSocketGateway.name);

  constructor(
    private readonly sharedService: SharedService,
  ) { }


  finishNotification(notification: EmailNotificationDto) {
    const { user, subject, job_id, message, status, emailType } = notification;
    let tipo = NotificacaoTipoEnum.MENSAGEM_PROGRAMADA;
    if(emailType == EmailTypeEnum.SEND){
      tipo = NotificacaoTipoEnum.MENSAGEM_COMUM;
      this.logger.log(`Notificando finalização de email ao usuário ${user.nome} - ${user.socket_id}`);
      this.server.to(user.socket_id)
        .emit('send-email_finished', { subject, job_id, message, status, tipo });
    }
    const statusNotificacao = status == STATUSES.completed ? NotificacaoStatus.SUCESSO : NotificacaoStatus.ERRO
    this.sharedService.createNewNotification({
      descricao: message,
      nome: `${subject.substring(0, 10)}... - ${job_id}`,
      status: statusNotificacao,
      tipo,
      requester_user: user,
    });
  }
}
