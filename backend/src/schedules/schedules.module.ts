import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CleanBullTasksSchedule } from './cleans/cleanBullTasks.schedule';
import { BullJobHistoriesModule } from '../modules/bull-job-histories/bull-job-histories.module';
import { User } from '../modules/users/entities/user.entity';
import { UsersRepository } from '../modules/users/repositories/implementations/UsersRepository';
import { SendMailJobModule } from '../jobs/email/send-mail-job/send-mail-job.module';
import { CleanTempFolderSchedule } from './cleans/cleanTempFolder.schedule';

@Module({
    imports: [TypeOrmModule.forFeature([User,]), BullJobHistoriesModule, SendMailJobModule],
    providers: [
        CleanBullTasksSchedule,
        CleanTempFolderSchedule, 
        UsersRepository
    ],
})
export class SchedulesModule { }
