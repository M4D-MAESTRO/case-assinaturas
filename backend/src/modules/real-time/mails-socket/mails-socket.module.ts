
import { Module } from '@nestjs/common';
import { SharedModule } from './../../../shared/modules/shared.module';
import { MailsSocketService } from './mails-socket.service';
import { MailsSocketGateway } from './mails-socket.gateway';

@Module({
  imports: [SharedModule,],
  providers: [MailsSocketGateway, MailsSocketService],
  exports: [MailsSocketGateway, MailsSocketService],
})
export class MailsSocketModule {}
