import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsUniqueNome } from '../validations/IsUniqueNome';

export class CreatePerfilDto {
    @ApiProperty({
        description: "Nome do perfil",
    })
    @IsNotEmpty({ message: 'O campo "nome" é obrigatório!'})
    @Transform(({ value }: TransformFnParams) => value?.trim().toUpperCase())
    @IsUniqueNome()
    nome: string;

    @ApiPropertyOptional({
        description: "Uma descrição para o perfil"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao: string;
}
