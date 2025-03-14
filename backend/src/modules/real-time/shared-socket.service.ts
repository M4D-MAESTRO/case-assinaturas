import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { use } from 'passport';
import { Socket } from 'socket.io';
import { AppError } from '../../errors/AppError';
import { UsersRepository } from '../users/repositories/implementations/UsersRepository';

@Injectable()
export class SharedSocketService {

    constructor(
        private readonly usersRepository: UsersRepository,
    ) { }

    async getUserFromSocket(client: Socket) {
        const user = this.usersRepository.findBySocketId(client.id);
        return user;
    }

    async getUserSocketByUserId(user_id: string) {
        const user = await this.usersRepository.findById(user_id);
        if (!user || !user.socket_id) {
            throw new AppError(`Usuário ${user_id} não encontrado. Falha ao estabelecer conexão em tempo real`);
        }
        return user;
    }

    async patchUserSocket(user_id: string, client: Socket) {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(`Usuário ${user_id} não encontrado. Falha ao estabelecer conexão em tempo real`);
        }

        user.socket_id = client.id;
        await this.usersRepository.save(user);
        return user;
    }

    async removeUserSocket(client: Socket) {
        const user = await this.usersRepository.findBySocketId(client.id);
        if (user && user.socket_id) {
            user.socket_id = null;
            await this.usersRepository.save(user);
        }
    }

}