import { BasicJobDto } from "../../../jobs/BasicJob.dto";

export class RecoveryUserMailDto extends BasicJobDto{
    nome: string;
    code: string;
    email: string;
}