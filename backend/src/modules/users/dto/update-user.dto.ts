import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { StatusUsuarioEnum } from '../../../shared/constants/status-usuario.constant';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;

    @ApiPropertyOptional({ description: "Código do status atual do patrimônio", examples: ["ATIVO", "AFASTADO", "FÉRIAS", "DESLIGADO", "DELETADO",] })
    @IsOptional()
    @IsEnum(StatusUsuarioEnum, { message: `O código do status atual é obrigatório!` })
    status: string;
}
