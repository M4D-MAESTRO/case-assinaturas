import { ModalidadesAssinaturaEnum } from './../../../../shared/constants/modalidade-assinaturas.const';
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { AssinaturasEnum } from './../../../../shared/constants/status-assinaturas.constant';

export class SearchAssinaturaDto {

    @ApiPropertyOptional({ description: "ID/Código da assinatura", example: "3f8fd54e-" })
    @IsOptional()
    searchedAssinatura?: string;

    @ApiPropertyOptional({ description: "Status da assinatura", example: AssinaturasEnum.ATIVO, enum: AssinaturasEnum })
    @IsEnum(AssinaturasEnum, { message: `Status de assinatura inválida` })
    @IsOptional()
    status: AssinaturasEnum;

    @ApiPropertyOptional({ description: "Modalidade da assinatura", example: ModalidadesAssinaturaEnum.MENSAL, enum: ModalidadesAssinaturaEnum })
    @IsEnum(ModalidadesAssinaturaEnum, { message: `Modalidade de assinatura inválida` })
    @IsOptional()
    modalidade: ModalidadesAssinaturaEnum;

    @ApiPropertyOptional({ description: "ID do plano associado à assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    plano_assinatura_id: string;

    @ApiPropertyOptional({ description: "ID do usuário inscrito na assinatura", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    assinante_id: string;

    @ApiPropertyOptional({ description: "Nome do plano", example: 'Plano sócio nível 1' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    searchedPlano?: string;

    @ApiPropertyOptional({ description: "Nome do assinante", example: 'Luís Henrique...' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    searchedAssinante?: string;

    @ApiPropertyOptional({ description: "Data de criação da assinatura", example: new Date() })
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    created_at?: Date;

    @ApiPropertyOptional({ description: "Data de iniciação da assinatura", example: new Date() })
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    data_inicio?: Date;

    @ApiPropertyOptional({ description: "Data de finalização da assinatura", example: new Date() })
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    data_fim: Date;

}