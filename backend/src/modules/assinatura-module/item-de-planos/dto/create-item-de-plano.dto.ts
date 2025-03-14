import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsUUID, } from 'class-validator';

export class CreateItemDePlanoDto {

    @ApiProperty({ description: "Nome do item", example: 'Cortes de cabelo ilimitado' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome: string;

    @ApiProperty({
        description: "Descrição do item",
        example: 'Direito a cortar o cabelo ilimitadamente, seja corte feminino ou masculino'
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao: string;

    @ApiPropertyOptional({ description: "Custo do item", example: 20.99 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "custo"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "custo"  deve ser um número positivo` })
    @IsOptional()
    custo?: number;

    @ApiPropertyOptional({ description: "Quantidade de itens disponível mensalmente", example: 2 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
        { message: `O campo "quantidade"  deve ser um número sem casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_acrescimo"  deve ser um número positivo` })
    @IsOptional()
    quantidade?: number;

    @ApiProperty({ description: "ID do produto original que faz parte do item de plano", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    produto_id?: string;

    @ApiProperty({ description: "ID do serviço original que faz parte do item de plano", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    servico_id?: string;
}
