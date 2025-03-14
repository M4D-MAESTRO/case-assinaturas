import { StatusCartaoEnum, TipoCartaoEnum } from './../../../../shared/constants/cartao.constant';

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class SearchCartaoClienteDto {

    @ApiProperty({ description: "ID/Código do cliente proprietário do cartão", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    cliente_id?: string;

    @ApiProperty({ description: "ID/Código do usuário quem registrou o cartão no sistema", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    user_registrou_id?: string;

    @ApiPropertyOptional({ description: "Status do cartão no sistema", example: StatusCartaoEnum.ATIVO, enum: StatusCartaoEnum })
    @IsEnum(StatusCartaoEnum, { message: `Status inválido` })
    @IsOptional()
    status: StatusCartaoEnum;

    @ApiPropertyOptional({ description: "Tipo de cartão no sistema", example: TipoCartaoEnum.CREDITO, enum: TipoCartaoEnum })
    @IsEnum(TipoCartaoEnum, { message: `Tipo inválido` })
    @IsOptional()
    tipo: TipoCartaoEnum;

}