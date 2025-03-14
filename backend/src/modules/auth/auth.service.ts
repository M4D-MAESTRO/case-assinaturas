
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from '../../shared/utils/daysDateUtils';
import { AppError } from '../../errors/AppError';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UsersTokenService } from '../users/users-token.service';
import { SendMailProducerService } from '../../jobs/email/send-mail-job/sendMail-procucer.service';
import { DefaultPayloadDto } from './dto/default-payload.dto';
import { Role } from '../../shared/authorizations/enums/role.enum';
import { client_pefil_id } from './../../shared/constants/system.constant';
import { StatusUsuarioEnum } from './../../shared/constants/status-usuario.constant';
import { MensagesConstants } from './../../shared/constants/mensages.constant';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly dayjsDateProvider: DayjsDateProvider,
        private readonly usersTokenService: UsersTokenService,
        private readonly sendMailProducerService: SendMailProducerService,
    ) { }

    async validateUser(email: string, senha: string): Promise<any> {
        this.logger.log(`Tentativa de login com o e-mail - (${email})`);
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            this.logger.warn(`Não existe usuário cadastrado no sistema - (${email})`);
            return null;
        }

        this.logger.log(`Comparando senha - (${email})`);
        const passwordMatch = process.env.MODE == 'DEV' ? true : await compare(senha, user.senha);

        if (passwordMatch) {
            this.logger.log(`Login efetuado com sucesso - (${email})`);
            const { senha, ...result } = user;
            return result;
        }
        this.logger.warn(`Senha inválida - (${email})`);
        return null;
    }

    async validateSwaggerStatusUser(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user || user.perfil.nome != Role.ADMIN_TI) {
            return false;
        }
        return true;
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new AppError(`Login ou senha inválidos!`, 401);
        }

        if (!user.status || user.status != StatusUsuarioEnum.ATIVO) {
            throw new AppError(`Acesso suspenso, usuário: ${user.status}`, 403);
        }

        return this.login(user);
    }

    async login(user: User) {

        const payload = this.generateUserPayload(user);
        const token = this.jwtService.sign(
            payload,
            {
                subject: payload.id,
                expiresIn: process.env.TOKEN_EXPIRES,
            }
        );

        const refresh_token = this.jwtService.sign(payload, {
            subject: payload.id,
            expiresIn: process.env.TOKEN_REFRESH_EXPIRES,
        });

        await this.usersTokenService.create(payload.id, refresh_token);

        return {
            token,
            refresh_token,
        };
    }


    async refreshToken(oldToken: string) {
        if (!oldToken) {
            return;
        }

        let user_id;
        try {
            const { sub } = this.jwtService.verify(oldToken, { secret: process.env.TOKEN_REFRESH_SECRET });
            user_id = sub;
        } catch (e) {
            throw new AppError(MensagesConstants.SESSAO_EXPIRADA, 403);
        }

        const userToken = await this.usersTokenService.findByUserIdAndRefreshToken(
            user_id,
            oldToken
        );

        if (!userToken) {
            throw new AppError("Token inexistente!", 403);
        }
        const { user } = userToken;
        
        if (!user.status || user.status != StatusUsuarioEnum.ATIVO) {
            throw new AppError(`Acesso suspenso, usuário: ${user.status}`, 403);
        }

        await this.usersTokenService.deleteById(userToken.id);
        const { email, perfil, avatar, id, nome } = user;
        const payload = { email, perfil_id: perfil.id, perfil_nome: perfil.nome, avatar, id, nome }

        const token = this.jwtService.sign(
            payload,
            {
                subject: user_id,
                expiresIn: process.env.TOKEN_EXPIRES,
            }
        );

        const refresh_token = this.jwtService.sign(payload, {
            subject: user_id,
            expiresIn: process.env.TOKEN_REFRESH_EXPIRES,
        });

        await this.usersTokenService.create(user_id, refresh_token);

        return {
            token,
            refresh_token,
        };

    }

    async requestRecovery(email: string) {
        this.logger.log(`Solicitação de recovery - (${email})`);
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            this.logger.warn(`Não existe usuário cadastrado no sistema - (${email})`);
            throw new AppError(`Usuário ${email} não encontrado`, 404);
        }

        const token = uuidV4().substring(0, 8);
        this.logger.warn(`Token gerado - (${email})`);

        const expires_date = this.dayjsDateProvider.addHours(3);

        await this.usersTokenService.create(user.id, token, expires_date);

        this.logger.warn(`Enviando e-mail com token - (${email})`);
        this.sendMailProducerService.sendRecoveryMailJob({ nome: user.nome, email, code: token })
    }

    async resetPassword(token: string, password: string) {
        this.logger.log(`Solicitação de reset - (${token})`);
        const userToken = await this.usersTokenService.findByRefreshToken(token);

        if (!userToken) {
            this.logger.warn(`Token inválido! - (${token})`);
            throw new AppError(`Token inválido!`);
        }

        if (this.dayjsDateProvider.compareIfBefore(userToken.expires_date, this.dayjsDateProvider.dateNow())) {
            this.logger.warn(`Token expirado! - (${token})`);
            throw new AppError(`Token expirado!`);
        }

        const user = await this.usersService.findOne(userToken.user_id);
        this.logger.log(`Usuário ${user.email} - (${token})`);

        user.senha = await hash(password, 8);

        await this.usersService.patchUser(user);
        this.logger.warn(`Senha do usuário ${user.email} resetado - (${token})`);
        await this.usersTokenService.deleteById(userToken.id);
    }

    private generateUserPayload(user: User): DefaultPayloadDto {
        const { email, perfil, avatar, id, nome } = user;
        const perfil_id = perfil?.id || null;
        const perfil_nome = perfil_id ? perfil.nome : null;

        const payload = { email, perfil_id, perfil_nome, avatar, id, nome };


        return payload;
    }


}

