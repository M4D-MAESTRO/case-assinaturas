
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate,  IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";


export class SearchPlanoDto {

    @ApiPropertyOptional({ description: "ID/Código do plano", example: "3f8fd54e-" })
    @IsOptional()
    searchedPlano?: string;

    @ApiPropertyOptional({ description: "Nome do plano", example: 'Plano sócio nível 1' })
    @IsOptional()
    nome?: string;

    @ApiPropertyOptional({
        description: "Descrição do plano",
        example: 'Plano recomendado para quem deseja ser sócio...'
    })
    @IsOptional()
    descricao?: string;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor mensal desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_valor_mensal" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_valor_mensal" deve ser positivo` })
    min_valor_mensal?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor mensal desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_valor_mensal" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_valor_mensal" deve ser positivo` })
    max_valor_mensal?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor trimestral desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_valor_trimestral" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_valor_trimestral" deve ser positivo` })
    min_valor_trimestral?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor trimestral desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_valor_trimestral" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_valor_trimestral" deve ser positivo` })
    max_valor_trimestral?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor semestral desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_valor_semestral" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_valor_semestral" deve ser positivo` })
    min_valor_semestral?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor semestral desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_valor_semestral" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_valor_semestral" deve ser positivo` })
    max_valor_semestral?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor anual desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_valor_anual" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_valor_anual" deve ser positivo` })
    min_valor_anual?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do valor anual desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_valor_anual" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_valor_anual" deve ser positivo` })
    max_valor_anual?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do custo mensal desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_custo_mensal" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_custo_mensal" deve ser positivo` })
    min_custo_mensal?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo do custo mensal desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_custo_mensal" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_custo_mensal" deve ser positivo` })
    max_custo_mensal?: number;

    @ApiPropertyOptional({ description: "Data de solicitação/criação do Pedido", example: new Date() })
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    created_at?: Date;

}