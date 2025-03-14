import * as fs from 'fs';
import * as path from 'path';
import { STATUSES } from '@bull-board/api/dist/src/constants/statuses';
import { BaseAdapter, } from '@bull-board/api/dist/src/queueAdapters/base';
import { QueueJob } from '@bull-board/api/dist/typings/app';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BullJobHistoriesService } from '../../modules/bull-job-histories/bull-job-histories.service';
import { getBullBoardQueues } from '../../jobs/bull-board.queue';
import { HistoriesJobsReport } from '../../modules/bull-job-histories/reports/historiesJobs.report';
import { UsersRepository } from '../../modules/users/repositories/implementations/UsersRepository';
import { SendMailProducerService } from '../../jobs/email/send-mail-job/sendMail-procucer.service';
import { FolderPathEnum } from '../../shared/constants/folder-path.constant';

@Injectable()
export class CleanTempFolderSchedule {
    private readonly logger = new Logger(CleanTempFolderSchedule.name);

    constructor(
        private bullJobHistoriesService: BullJobHistoriesService,
        private historiesJobsReport: HistoriesJobsReport,
        private sendMailProducerService: SendMailProducerService,
        private usersRepository: UsersRepository,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_11PM)
    //@Cron(CronExpression.EVERY_30_SECONDS)
    async handleCron() {
        this.logger.log('Iniciando atividade para limpeza da pasta TEMP');

        this.logger.log(`Resolvendo caminho para pasta TEMP: ${FolderPathEnum.CARGA_DADOS}`);
        const tempPath = path.resolve(__dirname, "..", "..", "..", FolderPathEnum.CARGA_DADOS);
        this.logger.log(`Pasta TEMP: ${tempPath}`);

        this.logger.log('Recuperando arquivos existendes na TEMP');
        const files: string[] = [];
        fs.readdirSync(tempPath).forEach(file => {
            files.push(file);
        });
        this.logger.log(`Arquivos: ${files}`);

        this.logger.log(`Recuperando as filas de JOBs`);
        const queues = getBullBoardQueues();

        const onGoingJobs: QueueJob[] = [];
        const statusJob = [
            STATUSES.active,
            STATUSES.delayed,
            STATUSES.paused,
            STATUSES.waiting,
        ];

        this.logger.log(`Recuperando os JOBs com status ${statusJob.join(";")}`);
        await Promise.all(
            queues.map(async (queue: BaseAdapter) => {
                const onGoingJob = await queue.getJobs(statusJob);
                onGoingJobs.push(...onGoingJob);
            })
        );

        this.logger.log(`Varrendo os JOBs recuperados`);
        if (onGoingJobs.length <= 0) {
            this.logger.log(`Não há nenhum JOB em processamento.`);
            const deletedCount = this.deleteFiles(files, tempPath);
            this.logger.log(`${deletedCount} arquivos deletados com sucesso!`);
            this.logger.log('Atividade de limpeza da pasta TEMP finalizada');
            return;
        }

        const filesToBeDeleted = files;
        onGoingJobs.forEach(job => {
            const jobJSON = job.toJSON();
            this.logger.log(`Job "${jobJSON.id}" do tipo "${jobJSON.name}"`);
            const filePath = jobJSON.data?.filePath as string || null;

            if (filePath && files.join(";").includes(filePath.split("/")[1])) {
                const fileName = filePath.split("/")[1];
                this.logger.log(`Possui o arquivo em ${fileName} em processamento`);
                this.logger.log(`O arquivo portanto, não será excluído`);
                const index = filesToBeDeleted.indexOf(fileName);
                filesToBeDeleted.splice(index, 1);
            } else {
                this.logger.log(`Não possui arquivos em processamento`);
            }
        })


        const deletedCount = this.deleteFiles(filesToBeDeleted, tempPath);
        this.logger.log(`${deletedCount} arquivos deletados com sucesso!`);
        this.logger.log('Atividade de limpeza da pasta TEMP finalizada');
        this.logger.log('\n');
    }

    private deleteFiles(filesToBeDeleted: string[], tempPath: string): number {
        let deletedCount = 0;
        if (filesToBeDeleted.length > 0) {
            filesToBeDeleted.forEach(file => {
                const fileToBeDeleted = path.resolve(tempPath, file);
                this.logger.log(`Deletando o arquivo: ${fileToBeDeleted}`);
                fs.unlinkSync(fileToBeDeleted);
                deletedCount++;
                this.logger.log(`Arquivo: ${fileToBeDeleted} deletado com sucesso!`);
            });
        } else {
            this.logger.log(`Não houve arquivos aptos a serem deletados`);
        }

        return deletedCount;
    }
}