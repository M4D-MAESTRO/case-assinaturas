import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { EnderecosModule } from './modules/enderecos/enderecos.module';
import { PerfisModule } from './modules/perfis/perfis.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { MailsModule } from './modules/mails/mails.module';
import { getEmailOptions } from './config/mail-source';
import { UpdateResourceMiddleware } from './shared/middlewares/UpdateResourceMiddleware';
import { SharedModule } from './shared/modules/shared.module';
import { SharedSocketModule } from './modules/real-time/shared-socket.module';
import { SendMailJobModule } from './jobs/email/send-mail-job/send-mail-job.module';
import { BullBoardModule } from './jobs/bull-board.module';
import { BullBoardController } from './jobs/bull-board.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesModule } from './schedules/schedules.module';
import { BullJobHistoriesModule } from './modules/bull-job-histories/bull-job-histories.module';
import { CaslModule } from './shared/authorizations/casl/casl.module';
import { TemplateCargasModule } from './modules/central-download/template-cargas/template-cargas.module';
import { options } from './config/data-source';
import { SwaggerStatsAuthorizationMiddleware } from './shared/middlewares/SwaggerStatsAuthorizationMiddleware';
import { AssinaturasModule } from './modules/assinatura-module/assinaturas/assinaturas.module';
import { PlanosModule } from './modules/assinatura-module/planos/planos.module';
import { ItemDePlanosModule } from './modules/assinatura-module/item-de-planos/item-de-planos.module';
import { CartaoClientesModule } from './modules/adm-pagamentos/cartao-clientes/cartao-clientes.module';
import { FormaPagamentosModule } from './modules/adm-pagamentos/forma-pagamentos/forma-pagamentos.module';
import { HealthModule } from './modules/app-configs/health/health.module';
import { TerminusLoggerService } from './modules/app-configs/terminus-logger/terminus-logger.service';
import { XmlResponseInterceptor } from './shared/middlewares/ResponseTypeMiddleware';
import { BullModule } from '@nestjs/bull';
import { NotificacoesModule } from './modules/notificacoes/notificacoes.module';

require('dotenv').config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(options),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'redis_db',
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
      },
    }),
    MailerModule.forRoot(getEmailOptions()),
    PassportModule,
    ConfigModule,
    UsersModule,
    EnderecosModule,
    PerfisModule,
    AuthModule,
    MailsModule,
    SharedModule,
    SharedSocketModule,
    SendMailJobModule,
    BullBoardModule,
    SchedulesModule,
    BullJobHistoriesModule,
    CaslModule,
    NotificacoesModule,
    TemplateCargasModule,
    AssinaturasModule,
    PlanosModule,
    ItemDePlanosModule,
    CartaoClientesModule,
    FormaPagamentosModule,
    HealthModule,
  ],
  controllers: [AppController, BullBoardController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: XmlResponseInterceptor,
    },
    TerminusLoggerService,
  ],
  exports: [],
})

export class AppModule implements NestModule {
  constructor(
    private dataSource: DataSource,
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateResourceMiddleware)
      .forRoutes(
        { path: 'beneficios/:id', method: RequestMethod.PUT },
        { path: 'perfis/:id', method: RequestMethod.PUT },
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'patrimonios/:id', method: RequestMethod.PUT },
        { path: 'despesas/:id', method: RequestMethod.PUT },
        { path: 'lojas/:id', method: RequestMethod.PUT },
        { path: 'cargos/:id', method: RequestMethod.PUT },
        { path: 'produtos/:id', method: RequestMethod.PUT },
        { path: 'servicos/:id', method: RequestMethod.PUT },
        { path: 'areas/:id', method: RequestMethod.PUT },
        { path: 'agendas/*/:id', method: RequestMethod.PUT },
        { path: 'item-de-planos/:id', method: RequestMethod.PUT },
        { path: 'planos/:id', method: RequestMethod.PUT },
        { path: 'assinaturas/:id', method: RequestMethod.PUT },
        { path: 'tipo-operacoes-saida/:id', method: RequestMethod.PUT },
        { path: 'solicitacoes/:id', method: RequestMethod.PUT },
        { path: 'niveis-aprovacao/:id', method: RequestMethod.PUT },
        { path: 'configuracoes-aprovacao/:id', method: RequestMethod.PUT },
        { path: 'aprovacoes-user/:id', method: RequestMethod.PUT },
      );

    consumer
      .apply(SwaggerStatsAuthorizationMiddleware)
      .forRoutes(
        { path: 'status', method: RequestMethod.GET }
      );

  }
}

