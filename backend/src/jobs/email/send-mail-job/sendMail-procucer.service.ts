import { UserHtmlEmailDto } from './../../../modules/mails/dto/user-html-email.dto';
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { CreatedUserMailDto } from "../dto/createdUserMail.dto";
import { JobLockDownReportDto } from "../dto/jobLockdownReportMail.dto";
import { RecoveryUserMailDto } from "../dto/recoveryUserMail.dto";
import { queuePool } from "../../../jobs/bull-board.queue";
import { User } from "../../../modules/users/entities/user.entity";
import { BullJobsType } from "../../../shared/constants/bullJobs-type.constant";


@Injectable()
export class SendMailProducerService {

    constructor(@InjectQueue('sendMail-queue') private queue: Queue) {
        queuePool.add(queue);
    }

    async sendRegisterMail(user: CreatedUserMailDto) {
        const job_type = BullJobsType.EMAIL;
        const affected_tables = null;
        const requester_user = new User();
        requester_user.id = process.env.SYSTEM_USER_ID;
        user.affected_tables = affected_tables;
        user.job_type = job_type;
        user.requester_user = requester_user;

        const attempts = process.env.MODE == 'DEV' ? 1 : 3;
        this.queue.add('sendRegisterMail-job', user, { attempts });
    }

    async sendRecoveryMailJob(recovery: RecoveryUserMailDto) {
        const job_type = BullJobsType.EMAIL;
        const affected_tables = null;
        const requester_user = new User();
        requester_user.id = process.env.SYSTEM_USER_ID;
        recovery.affected_tables = affected_tables;
        recovery.job_type = job_type;
        recovery.requester_user = requester_user;

        this.queue.add('sendRecoveryMail-job', recovery);
    }

    async sendJobLockdownReport(job: JobLockDownReportDto) {
        const job_type = BullJobsType.REPORT;
        const affected_tables = null;
        const requester_user = new User();
        requester_user.id = process.env.SYSTEM_USER_ID;
        job.affected_tables = affected_tables;
        job.job_type = job_type;
        job.requester_user = requester_user;

        this.queue.add('sendJobLockdownReportMail-job', job, { attempts: 1, });
    }

    async sendJobHtmlEmail(job: UserHtmlEmailDto) {
        const job_type = BullJobsType.EMAIL;
        const affected_tables = null;
        job.affected_tables = affected_tables;
        job.job_type = job_type;
        job.user_email = job.requester_user.email;
        job.user_name = job.requester_user.nome;

        this.queue.add('sendUserHtmlEmail-job', job, { attempts: 1, });
    }

}
