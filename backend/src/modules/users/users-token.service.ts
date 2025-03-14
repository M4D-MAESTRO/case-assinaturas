import { ClassSerializerInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { DayjsDateProvider } from '../../shared/utils/daysDateUtils';
import { UsersRepository } from "./repositories/implementations/UsersRepository";
import { UsersTokensRepository } from "./repositories/implementations/UsersTokensRepository";

@Injectable()
export class UsersTokenService {

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly usersTokenRepository: UsersTokensRepository,
        private readonly dayjsDateProvider: DayjsDateProvider,

    ) { }

    async create(user_id: string, refresh_token: string, refresh_token_expires_date?: Date) {
        refresh_token_expires_date = refresh_token_expires_date || this.dayjsDateProvider.addDays(
            Number(process.env.TOKEN_REFRESH_EXPIRES_DAYS)
        );

        const userToken = this.usersTokenRepository.create({
            user_id,
            refresh_token,
            expires_date: refresh_token_expires_date,
        });

        await this.usersTokenRepository.save(userToken);
    }

    async deleteById(id: string) {
        await this.usersTokenRepository.delete(id);
    }

    async findByRefreshToken(refresh_token: string) {
        const userToken = await this.usersTokenRepository.findOne({ where: { refresh_token } });

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ) {
        const usersTokens = await this.usersTokenRepository.findOne({
            where: {
                user_id,
                refresh_token,
            },
            relations: ['user', 'user.perfil']
        });
        return usersTokens;
    }
}