
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsUUID, IsEnum, ValidateNested, IsNotEmptyObject } from 'class-validator';

import { CreateFormaPagamentoDto } from './../../../adm-pagamentos/forma-pagamentos/dto/create-forma-pagamento.dto';
import { ModalidadesAssinaturaEnum } from './../../../../shared/constants/modalidade-assinaturas.const';

export class CreateAssinaturaDto {

    @ApiProperty({ description: "Modalidade da assinatura", example: ModalidadesAssinaturaEnum.MENSAL, enum: ModalidadesAssinaturaEnum })
    @IsEnum(ModalidadesAssinaturaEnum, { message: `Modalidade de assinatura inválida` })
    modalidade: ModalidadesAssinaturaEnum;

    @ApiProperty({ description: "ID do plano associado à assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro 'plano_assinatura_id' inválido! Esperado um UUID` })
    plano_assinatura_id: string;

    @ApiProperty({ description: "ID do usuário inscrito na assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro 'assinante_id' inválido! Esperado um UUID` })
    assinante_id: string;

    @ApiProperty({ description: "Objeto representando a forma de pagamento desejada", example: CreateFormaPagamentoDto })
    @IsNotEmptyObject({}, { message: `A Forma de Pagamento deve ser completamente preenchida!` })
    @Type(() => CreateFormaPagamentoDto)
    @ValidateNested()
    forma_pagamento: CreateFormaPagamentoDto;
}
