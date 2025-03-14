import { STATUSES } from '@bull-board/api/dist/src/constants/statuses';
import { BaseAdapter, } from '@bull-board/api/dist/src/queueAdapters/base';
import { QueueJob } from '@bull-board/api/dist/typings/app';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BullJobHistoriesService } from '../../modules/bull-job-histories/bull-job-histories.service';
import { CreateBullJobHistoryDto } from '../../modules/bull-job-histories/dto/create-bullJobHistory.dto';
import { getBullBoardQueues } from '../../jobs/bull-board.queue';
import { HistoriesJobsReport } from '../../modules/bull-job-histories/reports/historiesJobs.report';
import { Role } from '../../shared/authorizations/enums/role.enum';
import { UsersRepository } from '../../modules/users/repositories/implementations/UsersRepository';
import { SendMailProducerService } from '../../jobs/email/send-mail-job/sendMail-procucer.service';

@Injectable()
export class CleanBullTasksSchedule {
    private readonly logger = new Logger(CleanBullTasksSchedule.name);

    constructor(
        private bullJobHistoriesService: BullJobHistoriesService,
        private historiesJobsReport: HistoriesJobsReport,
        private sendMailProducerService: SendMailProducerService,
        private usersRepository: UsersRepository,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_10PM)
    // @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        this.logger.log('Iniciando atividade para limpeza de JOBs');
        const queues = getBullBoardQueues();
        await Promise.all(
            queues.map(async (queue: BaseAdapter) => {

                //Completado
                const completedJobs = await queue.getJobs([STATUSES.completed]);
                await this.moveToHistory(completedJobs, STATUSES.completed);

                //Falhado
                const failedJobs = await queue.getJobs([STATUSES.failed]);
                await this.moveToHistory(failedJobs, STATUSES.failed);
            })
        );

        await this.sendMail();
        this.logger.log('Atividade de limpeza de JOBs finalizada');
        this.logger.log('\n');
    }

    private async sendMail() {
        const emailList = (await this.usersRepository
            .listUsersByRoleName(Role.ADMIN_TI))
            .map(user => user.email) || process.env.MAIL_CONTIGENCIA;

        this.logger.log(`Administradores de T.I recuperados: ${emailList}`);

        try {
            const today = new Date(new Date().toDateString());
            this.logger.log(`Gerando relatório para enviar - ${today.toLocaleDateString('pt-BR')}`);

            const { reportName, xslxFile, completedCount, failedCount } = await this.historiesJobsReport.execute(today);
            this.sendMailProducerService.sendJobLockdownReport({ emailList, reportResult: { reportName, xslxFile, completedCount, failedCount } });

            this.logger.log('Relatório enviado aos administradores do sistema');
        } catch (e) {
            this.logger.error(`Falha na geração do relatório ${e.message}`);
            this.logger.error(e.stack);
        }
    }

    private async moveToHistory(jobs: QueueJob[], status: string) {
        this.logger.log(`Realizando movimentação para itens: ${status}`);

        const dto: CreateBullJobHistoryDto[] = [];
        jobs.forEach(async (job) => {
            const { data, name, id, attemptsMade, processedOn, finishedOn, failedReason, timestamp } = job.toJSON();
            const email_to = data?.email || data?.emailList?.join(';') || null;
            const affected_tables = data?.affected_tables || null;
            const job_type = data?.job_type || null;
            const requester_user = data?.requester_user || null;

            dto.push({
                attempts_made: attemptsMade?.toString() || null,
                email_to,
                failed_reason: failedReason,
                finished_on: new Date(finishedOn),
                job_id: id.toString(),
                name,
                processed_on: new Date(processedOn),
                started_on: new Date(timestamp),
                status,
                affected_tables,
                job_type,
                requester_user,
            })
            await job.remove();
        });

        await this.bullJobHistoriesService.create(dto);
        this.logger.log(`Movimentação de itens: ${status} concluído`);
    }
}