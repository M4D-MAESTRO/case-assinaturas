import { UserTokens } from "../entities/user-token.entity";

export interface IUsersTokensRepository {

    findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens>;

    deleteById(id: string): Promise<void>;

    findByRefreshToken(refresh_token: string): Promise<UserTokens>;
}