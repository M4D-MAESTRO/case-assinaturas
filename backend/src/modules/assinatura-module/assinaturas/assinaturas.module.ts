
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../../shared/authorizations/casl/casl.module';
import { AssinaturasService } from './assinaturas.service';
import { AssinaturasController } from './assinaturas.controller';
import { Assinatura } from './entities/assinatura.entity';
import { AssinaturasRepository } from './repositories/implementations/AssinaturasRepository';
import { SharedModule } from './../../../shared/modules/shared.module';
import { UsersModule } from './../../users/users.module';
import { FormaPagamentosModule } from './../../adm-pagamentos/forma-pagamentos/forma-pagamentos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assinatura]), CaslModule, forwardRef(() => UsersModule),
  forwardRef(() => SharedModule), forwardRef(() => FormaPagamentosModule),],
  controllers: [AssinaturasController],
  providers: [AssinaturasService, AssinaturasRepository]
})
export class AssinaturasModule { }
