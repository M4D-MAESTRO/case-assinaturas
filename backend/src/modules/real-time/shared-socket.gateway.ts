

import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StatusSocket } from '../../shared/constants/status-socket.constant';
import { User } from '../users/entities/user.entity';
import { SharedSocketService } from './shared-socket.service';

@WebSocketGateway({ cors: true })
export class SharedSocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private logger: Logger = new Logger(SharedSocketGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly sharedSocketService: SharedSocketService,
    ) { }

    @SubscribeMessage('start')
    async subscribeInWs(client: Socket, payload: unknown) {
        const { user_id } = payload as any;
        this.logger.log(`Usuário "${user_id}" conectado com o socket id: "${client.id}"`);
        const user = await this.sharedSocketService.patchUserSocket(user_id, client);
        this.server.to(user.socket_id)
            .emit('socket_connected', { connection: StatusSocket.ON });
    }

    afterInit(server: any) { }

    async handleConnection(client: Socket, ...args: any[]) { }

    async handleDisconnect(client: Socket) {
        this.server.to(client.id)
            .emit('socket_connected', { connection: StatusSocket.OFF });
        this.logger.log(`Cliente desconectado ${client.id}`);
        await this.sharedSocketService.removeUserSocket(client);
    }
}
