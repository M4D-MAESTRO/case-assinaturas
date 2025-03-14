import { SendMailProducerService } from './../../jobs/email/send-mail-job/sendMail-procucer.service';
import { Inject, Injectable, Scope, forwardRef } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getUserIdService } from './../../shared/utils/user-utils';

import { UsersService } from '../users/users.service';
import { UserHtmlEmailDto } from './dto/user-html-email.dto';

@Injectable({ scope: Scope.REQUEST })
export class MailsService {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly sendMailProducerService: SendMailProducerService,
    ) { }

    async sendHtmlEmail(dto: UserHtmlEmailDto) {
        const user_id = getUserIdService(this.request);
        const user = await this.usersService.findOne(user_id);
        dto.requester_user = user;
        
        this.sendMailProducerService.sendJobHtmlEmail(dto)
    }
}
