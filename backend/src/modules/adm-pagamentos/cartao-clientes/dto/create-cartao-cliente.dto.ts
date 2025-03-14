import { StatusCartaoEnum, TipoCartaoEnum } from './../../../../shared/constants/cartao.constant';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsUUID, IsEnum, Length, IsCreditCard, IsString, Matches, IsOptional } from 'class-validator';

export class CreateCartaoClienteDto {

    @ApiProperty({ description: "ID do plano associado à assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro 'plano_assinatura_id' inválido! Esperado um UUID` })
    cliente_id: string;

    @ApiProperty({ description: "ID do usuário inscrito na assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    assinante_id: string;

    @ApiProperty({ description: "Número do cartão", example: "1234567890123456" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsCreditCard({ message: `Cartão com numeração inválida!` })
    numero_cartao: string;

    @ApiProperty({ description: "Nome do titular do cartão", example: "Luís Henrique..." })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome_titular: string;

    @ApiProperty({ description: "Validade do cartão", example: "08/2023" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString({message: `O campo 'validade' só aceita strings `})
    @Matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, {message: `Valor inválido, esperado string no padrão MM/YYYY`})
    validade: string;

    @ApiProperty({ description: "Código de segurança do cartão", example: "123" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString({message: `O campo 'codigo_seguranca' só aceita strings `})
    @Matches(/^[0-9]{3,4}$/, {message: `Valor inválido, esperado string com 3 ou 4 dígitos`})
    codigo_seguranca: string

    @ApiProperty({ description: "Últimos quatro dígitos do cartão", example: "3456" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    ultimos_digitos: string;

    @ApiProperty({ description: "Tipo de cartão no sistema", example: TipoCartaoEnum.CREDITO, enum: TipoCartaoEnum })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsEnum(TipoCartaoEnum, { message: `Tipo de cartão inválido` })
    tipo: TipoCartaoEnum;

    @ApiPropertyOptional({
        description: "Token de pagamento utilizado",
        example: 'tok_1N0X4U2eZvKYlo2CUQXhaTrt'
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    token_pagamento?: string;
}
