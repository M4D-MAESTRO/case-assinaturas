import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {

    @ApiProperty({ description: "E-mail do usuário", example: "exemplo@exemplo.com" })
    username: string;

    @ApiProperty({ description: "Senha do usuário", })
    password: string;
}

export class LoginResponseDto {

    @ApiProperty({ description: "Token do usuário", example: "eyJhbGciO..." })
    token: string;

    @ApiProperty({ description: "Refresh token do usuário", example: "eyJhbGciOiJ..." })
    refresh_token: string;
}

export class RefreshTokenRequestDto {

    @ApiProperty({ description: "Refresh token atual do usuário", example: "eyJhbGciO..." })
    token: string;
}

export class ForgotRequestDto {

    @ApiProperty({ description: "E-mail do usuário que deseja recuperar a senha", example: "example@example.com" })
    email: string;
}

export class ResetPasswordRequestBodyDto {
    @ApiProperty({ description: "Nova senha de usuário", })
    password: string;
}

export class ResetPasswordRequestQueryDto {
    @ApiProperty({ description: "O código recebido no e-mail", example: "49a448ea"})
    token: string;
}
