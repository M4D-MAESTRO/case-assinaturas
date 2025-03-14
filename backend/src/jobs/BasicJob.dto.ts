import { User } from "../modules/users/entities/user.entity";

export class BasicJobDto {
    job_type?: string;
    affected_tables?: string;
    requester_user?: User;
}

export class BasicCargaJobDto extends BasicJobDto{
    user: User;
    filePath: string;
}