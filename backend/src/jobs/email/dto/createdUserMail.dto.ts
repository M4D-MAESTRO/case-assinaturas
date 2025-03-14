import { BasicJobDto } from "../../../jobs/BasicJob.dto";

export class CreatedUserMailDto extends BasicJobDto{
    nome: string;
    email: string;
    senha: string;
}