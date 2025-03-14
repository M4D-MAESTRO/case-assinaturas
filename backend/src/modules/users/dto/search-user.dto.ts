import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { StatusUsuarioEnum, TipoUsuarioEnum } from "../../../shared/constants/status-usuario.constant";
import { Type } from "class-transformer";


export class SearchUserDto {
    @ApiPropertyOptional({ description: "ID da loja em que usuário está cadastrado", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @IsOptional()
    loja_id?: string;

    @ApiPropertyOptional({ description: "Nome, e-mail ou CPF do usuário", examples: ["rique", "8567", "hotmail"] })
    @IsOptional()
    searchedUser?: string;

    @ApiPropertyOptional({ description: "Nome do usuário", example: "Henrique de Castro" })
    @IsOptional()
    nome?: string;

    @ApiPropertyOptional({ description: "E-mail do usuário", example: "example@example.com" })
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ description: "CPF do usuário", examples: ["123.456.789-99", "12345678999"] })
    @IsOptional()
    cpf?: string;

    @ApiPropertyOptional({ description: "Código do status atual do patrimônio", enum: StatusUsuarioEnum })
    @IsOptional()
    @IsEnum(StatusUsuarioEnum, { message: `O código do status atual deve ser ["ATIVO", "AFASTADO", "FÉRIAS", "DESLIGADO" ou "DELETADO"]` })
    status?: string;

    @ApiPropertyOptional({ description: "Tipo de usuário desejado", enum: TipoUsuarioEnum })
    @IsOptional()
    @IsEnum(TipoUsuarioEnum, { message: `Tipo de usuário inválido` })
    tipo_usuario?: string;

    @ApiPropertyOptional({ description: "Tipo de usuário desejado", default: false, example: false })
    @IsOptional()
    @IsBoolean({ message: `O valor deve ser booleano` })
    @Type(() => Boolean)
    load_cliente_nao_identificado?: boolean;
}