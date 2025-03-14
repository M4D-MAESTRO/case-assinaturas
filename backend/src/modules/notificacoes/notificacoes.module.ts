import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacao } from './entities/notificacoe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacao])],
  controllers: [NotificacoesController],
  providers: [NotificacoesService],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
