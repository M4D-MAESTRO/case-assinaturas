import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/implementations/UsersRepository';
import { SharedSocketGateway } from './shared-socket.gateway';
import { SharedSocketService } from './shared-socket.service';
import { MailsSocketModule } from './mails-socket/mails-socket.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailsSocketModule,],
    providers: [SharedSocketGateway, SharedSocketService, UsersRepository],
    exports: [SharedSocketGateway, SharedSocketService, ]
})
export class SharedSocketModule { }
