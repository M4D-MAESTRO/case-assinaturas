import { PartialType } from '@nestjs/mapped-types';
import { BasicJobDto } from '../../../jobs/BasicJob.dto';
import { ReportResultDto } from '../../../shared/dtos/reports/reportResult.dto';

export class JobLockDownReportDto extends PartialType(BasicJobDto) {
    emailList: string | string[];
    reportResult: ReportResultDto;
}