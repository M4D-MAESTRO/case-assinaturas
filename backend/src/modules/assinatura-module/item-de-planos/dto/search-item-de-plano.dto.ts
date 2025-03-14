
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";


export class SearchItemDePlanoDto {

    @ApiPropertyOptional({ description: "ID/Código do item", example: "3f8fd54e-" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    searchedItem?: string;

    @ApiPropertyOptional({ description: "Nome do item", example: 'Cortes de cabelo ilimitado' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    nome?: string;

    @ApiPropertyOptional({ description: "Descrição do item", example: 'Direito a cortar o cabelo ilimitadamente, seja corte feminino ou masculino' }) 
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    descricao?: string;

    @ApiPropertyOptional({ description: "Intervalo mínimo de custo desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_custo" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_custo" deve ser positivo` })
    min_custo?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo de custo desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_custo" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_custo" deve ser positivo` })
    max_custo?: number;

    @ApiPropertyOptional({ description: "Intervalo mínimo de quantidade desejado", example: 1 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0, },
        { message: `O campo "min_quantidade" deve ser um número sem casas decimais e finito` })
    @IsPositive({ message: `O campo "min_quantidade" deve ser positivo` })
    min_quantidade?: number;

    @ApiPropertyOptional({ description: "Intervalo máximo de quantidade desejado", example: 5 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0, },
        { message: `O campo "max_quantidade" deve ser um número sem casas decimais e finito` })
    @IsPositive({ message: `O campo "max_quantidade" deve ser positivo` })
    max_quantidade?: number;

    @ApiPropertyOptional({ description: "Data de solicitação/criação do Pedido", example: new Date() })
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    created_at?: Date;

}