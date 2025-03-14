import { forwardRef, Module } from '@nestjs/common';

import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { UsersModule } from '../users/users.module';
import { SendMailJobModule } from '../../jobs/email/send-mail-job/send-mail-job.module';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SendMailJobModule,
    CaslModule,
  ],
  controllers: [MailsController],
  providers: [MailsService]
})
export class MailsModule {}
