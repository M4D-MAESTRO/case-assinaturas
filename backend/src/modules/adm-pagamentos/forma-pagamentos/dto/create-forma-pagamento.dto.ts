import { PagamentoFormasEnum } from './../../../../shared/constants/pagamento-formas.constant';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsUUID, IsEnum, Length, IsCreditCard, IsString, Matches, IsOptional } from 'class-validator';

export class CreateFormaPagamentoDto {

    @ApiProperty({ description: "Tipo de pagamento", example: PagamentoFormasEnum.CARTAO_CREDITO, enum: PagamentoFormasEnum })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    tipo: PagamentoFormasEnum;

    @ApiPropertyOptional({ description: "Cartão do cliente utilizado no pagamento", example: '3f8fd54e-0773-4103-9758-07871885a89e' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    cartao_cliente_id?: string;
}
