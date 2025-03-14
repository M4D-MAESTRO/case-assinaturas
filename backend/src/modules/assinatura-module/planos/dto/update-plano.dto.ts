import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreatePlanoDto } from './create-plano.dto';

export class UpdatePlanoDto extends PartialType(CreatePlanoDto) {
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;

    @ApiPropertyOptional({ description: "Lista de itens (ID) para desassociar do plano", isArray: true })
    @IsArray()
    @IsUUID(null, { each: true })
    @IsOptional()
    itens_desassociar?: string[];
}
