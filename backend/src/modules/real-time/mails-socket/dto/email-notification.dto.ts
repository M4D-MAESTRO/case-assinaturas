import { EmailTypeEnum } from "./../../../../shared/constants/email-type.constant";
import { BasicNotificationDto } from "../../dto/basic-notification.dto";


export abstract class EmailNotificationDto extends BasicNotificationDto{
    emailType: EmailTypeEnum;
    subject: string;
}