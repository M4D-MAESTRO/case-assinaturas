import { PartialType } from '@nestjs/swagger';
import { CreateItemDePlanoDto } from './create-item-de-plano.dto';
import { IsUUID } from 'class-validator';

export class UpdateItemDePlanoDto extends PartialType(CreateItemDePlanoDto) {
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;
}
