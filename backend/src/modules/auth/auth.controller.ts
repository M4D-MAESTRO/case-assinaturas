import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../config/public-endpoint.config';
import { AuthService } from './auth.service';
import { ForgotRequestDto, LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto, ResetPasswordRequestBodyDto, ResetPasswordRequestQueryDto } from './dto/authentication-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Autenticação') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }

  @Public()
  //@UseGuards(AuthGuard('local')) - Teste
  @Post('login')
  @ApiOperation({ summary: 'Realiza a autenticação de um usuário por e-mail e senha' })
  @ApiResponse({ status: 200, isArray: false, type: LoginResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req) {
    const { username, password } = req.body;
    return this.authService.validate(username, password);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Realiza um refresh no token de um usuário' })
  @ApiResponse({ status: 200, isArray: false, type: LoginResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiBody({ type: RefreshTokenRequestDto })
  async refresh(@Request() req) {
    const { token } = req.body;
    return this.authService.refreshToken(token);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('forgot')
  @ApiOperation({ summary: 'Realiza uma requisição de reset de senha a partir de um e-mail de um usuário' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiBody({ type: ForgotRequestDto })
  async requestRecovery(@Request() req) {
    const { email } = req.body;
    return this.authService.requestRecovery(email);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('reset')
  @ApiOperation({ summary: 'Realiza um refresh no token de um usuário' })
  @ApiResponse({ status: 200, isArray: false, type: LoginResponseDto })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiBody({ type: ResetPasswordRequestBodyDto })
  @ApiQuery({ type: ResetPasswordRequestQueryDto })
  async resetPassword(@Request() req) {
    const { token } = req.query;
    const { password } = req.body;
    return this.authService.resetPassword(token, password);
  }



}
