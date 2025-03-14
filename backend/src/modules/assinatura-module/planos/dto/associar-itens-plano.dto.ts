
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssociarItemPlanoDto {
    

    @ApiProperty({ description: "Lista de itens (ID) para associar ao plano", isArray: true })
    @IsArray()
    @IsUUID(null, { each: true })
    itens_associar?: string[];
}
