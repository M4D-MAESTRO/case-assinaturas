import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { EstadosEnum } from '../../../shared/constants/estados.constant';
import { ClearSpecialCharacters } from '../../../shared/utils/strings';

export class CreateEnderecoDto {
    @ApiProperty({
        description: "CEP do endereço", example: "25350003"
    })
    @IsNotEmpty({ message: 'O campo "cep" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Transform(({ value }: TransformFnParams) => ClearSpecialCharacters(value))
    cep: string;

    @ApiProperty({
        description: "O endereço", example: "Rua do exemplo"
    })
    @IsNotEmpty({ message: 'O campo "endereco" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    endereco: string;

    @ApiProperty({
        description: "Número do endereço", example: "S.N"
    })
    @IsNotEmpty({ message: 'O campo "número" é obrigatório!\nCaso não tenha número, coloque "S.N"' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    numero: string;

    @ApiPropertyOptional({
        description: "Um complemento para o endereço", example: "Loja 204"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    complemento: string;

    @ApiProperty({
        description: "O bairro do endereço", example: "Ipiranga"
    })
    @IsNotEmpty({ message: 'O campo "bairro" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    bairro: string;

    @ApiProperty({
        description: "A cidade do endereço", example: "São Paulo"
    })
    @IsNotEmpty({ message: 'O campo "cidade" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    cidade: string;

    @ApiProperty({
        description: "Sigla do estado", examples: ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]
    })
    @IsNotEmpty({ message: 'O campo "estado" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsEnum(EstadosEnum, { message: 'Insira uma sigla válida!' })
    estado: string;
}
