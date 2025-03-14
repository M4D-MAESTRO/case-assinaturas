import { PartialType } from '@nestjs/swagger';
import { CreateNotificacoeDto } from './create-notificacoe.dto';

export class UpdateNotificacoeDto extends PartialType(CreateNotificacoeDto) {}
