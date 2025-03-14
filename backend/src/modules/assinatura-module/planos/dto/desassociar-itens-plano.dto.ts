
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DesassociarItemPlanoDto {
    

    @ApiProperty({ description: "Lista de itens (ID) para desassociar do plano", isArray: true })
    @IsArray()
    @IsUUID(null, { each: true })
    itens_desassociar?: string[];
}
