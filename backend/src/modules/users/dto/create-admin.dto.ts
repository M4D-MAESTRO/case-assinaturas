import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length,  MinLength } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({ description: "Nome do usuário", example: "Henrique de Castro"})
    @IsNotEmpty({ message: 'O campo "nome" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome: string;

    @ApiProperty({ description: "E-mail do usuário", example: "example@example.com"})
    @IsNotEmpty({ message: 'O campo "email" é obrigatório!' })
    @IsEmail({ message: `Insira um e-mail válido!` })
    @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
    email: string;

    @ApiProperty({ description: "Senha do usuário",})
    @IsNotEmpty({ message: 'O campo "senha" é obrigatório!' })
    @MinLength(6, { message: `A senha deve ter pelo menos seis caracteres ` })
    senha: string;

    @ApiProperty({ description: "CPF do usuário", examples: ["123.456.789-99", "12345678999"]})
    @IsNotEmpty({ message: 'O campo "cpf" é obrigatório!' })
    @Length(11, 11, { message: `O CPF deve ter exatamente onze caracteres `, })
    @Transform(({ value }: TransformFnParams) => value?.replace(/[^a-zA-Z0-9]/g, '').trim())
    cpf: string;

}