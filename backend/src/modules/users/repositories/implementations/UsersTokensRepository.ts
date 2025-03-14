
import { Injectable } from "@nestjs/common";
import { DataSource,  Repository } from "typeorm";
import { UserTokens } from "../../entities/user-token.entity";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

@Injectable()
export class UsersTokensRepository extends Repository<UserTokens> implements IUsersTokensRepository {

    constructor(private dataSource: DataSource) {
        super(UserTokens, dataSource.createEntityManager());
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens> {
        const usersTokens = await this.findOne({
            where: {
                user_id,
                refresh_token,
            }
        });
        return usersTokens;
    }

    async deleteById(id: string): Promise<void> {
        await this.delete(id);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = await this.findOne({ where: { refresh_token } });

        return userToken;
    }
}