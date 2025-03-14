import { EmailTypeEnum } from './../../../shared/constants/email-type.constant';
import { STATUSES } from '@bull-board/api/dist/src/constants/statuses';
import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Buffer } from "buffer";
import { Job } from "bull";

import { EmailTemplateEnum } from "../../../shared/constants/email-template.constant";
import { CreatedUserMailDto } from "../dto/createdUserMail.dto";
import { JobLockDownReportDto } from "../dto/jobLockdownReportMail.dto";
import { RecoveryUserMailDto } from "../dto/recoveryUserMail.dto";
import { MailsSocketGateway } from './../../../modules/real-time/mails-socket/mails-socket.gateway';
import { SharedOperationsService } from './../../../shared/modules/shared-operations/shared-operations.service';
import { UserHtmlEmailDto } from './../../../modules/mails/dto/user-html-email.dto';
import { EmailNotificationDto } from "src/modules/real-time/mails-socket/dto/email-notification.dto";

@Processor('sendMail-queue')
export class SendMailConsumer {

    constructor(
        private readonly mailerService: MailerService,
        private readonly mailsSocketGateway: MailsSocketGateway,
        private readonly sharedOperationsService: SharedOperationsService,
    ) { }

    @Process('sendRegisterMail-job')
    async sendRegisterMailJob(job: Job<CreatedUserMailDto>) {
        job.log(`Iniciando o JOB: "envio de e-mail de cadastro"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        job.log(`Enviando e-mail para: ${data.email}`);
        await this.mailerService
            .sendMail({
                to: data.email, // para
                from: process.env.MAIL_FROM, // de
                subject: `Cadastro efetuado no ${process.env.SYSTEM_NICKNAME}`, // titulo
                template: EmailTemplateEnum.WELCOME, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
                context: {
                    SYSTEM_LOGO: process.env.SYSTEM_LOGO,
                    SYSTEM_NICKNAME: process.env.SYSTEM_NICKNAME,
                    SYSTEM_NAME: process.env.SYSTEM_NAME,
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                },
            });

        job.log(`Finalizando o JOB: "envio de e-mail de cadastro"`);
    }

    @Process('sendRecoveryMail-job')
    async sendRecoveryMailJob(job: Job<RecoveryUserMailDto>) {
        job.log(`Iniciando o JOB: "envio de e-mail de recuperação da conta"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { data } = job;
        job.log(`Enviando e-mail para: ${data.email}`);

        await this.mailerService
            .sendMail({
                to: data.email, // para
                from: process.env.MAIL_FROM, // de
                subject: `[${process.env.SYSTEM_NICKNAME}] Solicitação de recuperação de conta`, // titulo
                template: EmailTemplateEnum.FORGOT_PASSWORD, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
                context: {
                    SYSTEM_LOGO: process.env.SYSTEM_LOGO,
                    SYSTEM_NICKNAME: process.env.SYSTEM_NICKNAME,
                    SYSTEM_NAME: process.env.SYSTEM_NAME,
                    nome: data.nome,
                    code: data.code,
                },
            });
        job.log(`Finalizando o JOB: "envio de e-mail de recuperação da conta"`);
    }

    @Process('sendJobLockdownReportMail-job')
    async sendJobLockdownReportMailJob(job: Job<JobLockDownReportDto>) {
        job.log(`Iniciando o JOB: "envio de relatório de fechamento dos JOBs"`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { emailList } = job.data;
        const { completedCount, failedCount, reportName, xslxFile } = job.data.reportResult;
        job.log(`Convertendo o arquivo a partir do Buffer`);
        const content = Buffer.from(xslxFile);
        job.log(`Enviando email para: ${emailList.toString()}`);
        job.log(`JOBs com sucesso: ${completedCount}`);
        job.log(`JOBs com falhas: ${failedCount}`);
        await this.mailerService
            .sendMail({
                to: emailList, // para
                from: process.env.MAIL_FROM, // de
                subject: `[${process.env.SYSTEM_NICKNAME}] - Relatório de Jobs diário`, // titulo
                template: EmailTemplateEnum.REPORT_JOB, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
                context: {
                    SYSTEM_LOGO: process.env.SYSTEM_LOGO,
                    SYSTEM_NICKNAME: process.env.SYSTEM_NICKNAME,
                    completed: completedCount,
                    failed: failedCount,
                },
                attachments: [{
                    filename: reportName,
                    content,
                    contentType: 'xlsx'
                }]
            });
        job.log(`Finalizando o JOB: "envio de relatório de fechamento dos JOBs"`);
    }

    @Process('sendUserHtmlEmail-job')
    async sendUserHtmlEmailJob(job: Job<UserHtmlEmailDto>) {
        const { html, user_email, user_name, subject } = job.data;
        job.log(`Envio de e-mail solicitado por ${user_name}`);
        job.log(`JOB do tipo: ${job.data.job_type}`);
        const { email_list } = job.data;


        await new Promise(resolve => {
            setTimeout(resolve, 4000);
        });

        job.log(`Enviando email para: ${email_list.toString()}`);
        await this.mailerService
            .sendMail({
                to: email_list, // para
                from: user_email, // de
                subject, // titulo
                html
            });
        job.log(`Finalizando o JOB: "envio de relatório de fechamento dos JOBs"`);
    }

    @OnQueueCompleted()
    async handleSucess(job: Job, result: any) {
        if(job.name != 'sendUserHtmlEmail-job'){
            return;
        }
        const { subject, requester_user } = job.data;
        const message = `Oi ${requester_user.nome}, o seu e-mail "${subject?.substring(0, 10)}..." foi enviado com sucesso`;
        const notification: EmailNotificationDto = {
            subject,
            job_id: job.id.toString(),
            status: STATUSES.completed,
            user: requester_user,
            message,
            emailType: EmailTypeEnum.SEND,
            
        }

        this.mailsSocketGateway.finishNotification(notification);
    }

    @OnQueueFailed()
    async handleFailed(job: Job, err: Error) {
        if(job.name != 'sendUserHtmlEmail-job'){
            return;
        }
        const { subject, requester_user } = job.data;
        const message = `Oi ${requester_user.nome}, infelizmente o seu e-mail "${subject?.substring(0, 10)}..." falhou`;

        const notification: EmailNotificationDto = {
            subject,
            job_id: job.id.toString(),
            status: STATUSES.failed,
            user: requester_user,
            message,
            emailType: EmailTypeEnum.SEND
        }
        this.mailsSocketGateway.finishNotification(notification);
    }

}