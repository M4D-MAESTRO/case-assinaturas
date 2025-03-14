import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BullBoardController } from './bull-board.controller';
import { BullBoardQueue } from './bull-board.queue';
import { SendMailJobModule } from './email/send-mail-job/send-mail-job.module';
import { BullBoardAccessService } from './bull-board-acess.service';
import { jwtConstants } from '../modules/auth/constants/jwtConstants';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60d' },
        }),
        SendMailJobModule,
    ],
    controllers: [BullBoardController],
    providers: [BullBoardQueue, BullBoardAccessService],
    exports: [BullBoardAccessService]
})
export class BullBoardModule { }
