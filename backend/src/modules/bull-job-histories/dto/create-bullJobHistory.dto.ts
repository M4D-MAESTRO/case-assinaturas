import { User } from "../../../modules/users/entities/user.entity";


export class CreateBullJobHistoryDto {
    job_id: string;
    name: string;
    attempts_made: string;
    status: string;
    failed_reason: string;
    email_to: string;
    job_type: string;
    affected_tables: string;
    started_on: Date;
    processed_on: Date;
    finished_on: Date;
    requester_user?: User;
}