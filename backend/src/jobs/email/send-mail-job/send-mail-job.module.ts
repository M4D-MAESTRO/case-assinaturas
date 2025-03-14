
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailsSocketModule } from './../../../modules/real-time/mails-socket/mails-socket.module';
import { SendMailConsumer } from './sendMail-consumer';
import { SendMailProducerService } from './sendMail-procucer.service';
import { SharedOperationsModule } from '../../../shared/modules/shared-operations/shared-operations.module';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
    MailsSocketModule,
    SharedOperationsModule,
  ],
  providers: [
    SendMailProducerService, 
    SendMailConsumer,
  ],
  exports: [SendMailProducerService],
})
export class SendMailJobModule { }
