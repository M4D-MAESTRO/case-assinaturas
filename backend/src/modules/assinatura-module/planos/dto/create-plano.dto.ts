import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from 'class-validator';

export class CreatePlanoDto {

    @ApiPropertyOptional({ description: "Nome do plano", example: 'Plano sócio nível 1' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome: string;

    @ApiPropertyOptional({
        description: "Descrição do plano",
        example: 'Plano recomendado para quem deseja ser sócio...'
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    descricao: string;

    @ApiPropertyOptional({ description: "Valor mensal do plano", example: 20.99 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_mensal"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_mensal"  deve ser um número positivo` })
    valor_mensal: number;

    @ApiPropertyOptional({ description: "Valor do plano trimestral", example: 140.99 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_trimestral"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_trimestral"  deve ser um número positivo` })
    @IsOptional()
    valor_trimestral?: number;

    @ApiPropertyOptional({ description: "Valor do plano semestral", example: 260.90 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_semestral"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_semestral"  deve ser um número positivo` })
    @IsOptional()
    valor_semestral?: number;

    @ApiPropertyOptional({ description: "Valor do plano anual", example: 500.00 })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_anual"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_anual"  deve ser um número positivo` })
    @IsOptional()
    valor_anual?: number;

    @ApiPropertyOptional({
        description: "Custo que o plano gera mensalmente à corporação \nSe não for preenchido, o sistema calculará com base nos itens associados",
        example: 50.00
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "custo_mensal"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "custo_mensal"  deve ser um número positivo` })
    @IsOptional()
    custo_mensal?: number;

    @ApiPropertyOptional({ description: "Lista de itens (ID) para associar ao plano", isArray: true })
    @IsArray()
    @IsUUID(null, { each: true })
    @IsOptional()
    itens_associar?: string[];
}
