import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
    @ApiProperty({ description: "Senha do usuário", })
    @IsNotEmpty({ message: 'O campo "senha" é obrigatório!' })
    @MinLength(6, { message: `A senha deve ter pelo menos seis caracteres ` })
    senha: string;
}
