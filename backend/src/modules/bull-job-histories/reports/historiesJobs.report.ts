import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { Workbook } from "exceljs";
import { STATUSES } from '@bull-board/api/dist/src/constants/statuses';

import { ExcelUtils } from "../../../shared/utils/excelUtils";
import { ReportResultDto } from "../../../shared/dtos/reports/reportResult.dto";
import { BullJobHistory } from "../entities/bullJobHistory.entity";

@Injectable()
export class HistoriesJobsReport {

    constructor(
        @InjectRepository(BullJobHistory)
        private readonly bullJobHistoryRepository: Repository<BullJobHistory>,
    ) { }

    async execute(date: Date): Promise<ReportResultDto> {
        const [reportName, workbook] = ExcelUtils.startExcel('Execução diária de JOBs');

        const { jobsCount: completedCount } = await this.addSheetInfo(workbook, 'Jobs Completados', STATUSES.completed, date);
        const { jobsCount: failedCount } = await this.addSheetInfo(workbook, 'Jobs Falhados', STATUSES.failed, date);

        const xslxFile = await workbook.xlsx.writeBuffer();
        const result = {
            xslxFile: xslxFile,
            reportName,
            completedCount,
            failedCount,
        }

        return result;
    }

    private async addSheetInfo(workbook: Workbook, sheetName: string, status: string, started_on: Date) {
        const [jobsData, jobsCount] = await this.bullJobHistoryRepository.findAndCount({
            where: { status, started_on: MoreThan(started_on) },
            relations: ['requester_user'],
            select: [
                'id', 'job_id', 'job_type', 'affected_tables', 'name', 'email_to', 'requester_user', 'attempts_made',
                'status', 'failed_reason', 'started_on', 'processed_on', 'finished_on'
            ],
        });

        if (jobsCount >= 1) {
            const sheet = workbook.addWorksheet(sheetName, { properties: { tabColor: { argb: 'FFC0000' } } });
            ExcelUtils.cleanExcel(sheet);
            const columns = Object.keys(jobsData[0]);

            const sheetColumns = columns.map(c => {
                return {
                    header: c.toUpperCase(),
                    key: c.toUpperCase()
                }
            });
            sheet.columns = sheetColumns;
            jobsData.forEach(linha => {
                const values = Object.values(linha);
                values[12] = values[12] ? `${values[12].email} (${values[12].id})` : null;
                sheet.addRow(values)
            });
        }

        return { workbook, jobsCount };

    }

}