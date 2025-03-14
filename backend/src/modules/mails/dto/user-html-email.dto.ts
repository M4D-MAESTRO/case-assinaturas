import { PartialType } from '@nestjs/mapped-types';
import { BasicJobDto } from './../../../jobs/BasicJob.dto';

export class UserHtmlEmailDto extends PartialType(BasicJobDto){
    html: string;
    user_email: string; 
    user_name: string;
    subject: string;
    email_list: string[];
}