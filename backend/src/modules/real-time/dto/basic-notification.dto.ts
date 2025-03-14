import { JobStatus } from 'bull';
import { User } from './../../users/entities/user.entity';

export abstract class BasicNotificationDto{
    user: User;
    job_id: string;
    status: JobStatus;
    message: string;
}