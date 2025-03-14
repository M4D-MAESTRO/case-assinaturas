import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BullJobHistoriesService } from './bull-job-histories.service';
import { BullJobHistory } from './entities/bullJobHistory.entity';
import { HistoriesJobsReport } from './reports/historiesJobs.report';

@Module({
  imports: [TypeOrmModule.forFeature([BullJobHistory,])],
  providers: [BullJobHistoriesService, HistoriesJobsReport,],
  exports: [BullJobHistoriesService, HistoriesJobsReport]
})
export class BullJobHistoriesModule { }
