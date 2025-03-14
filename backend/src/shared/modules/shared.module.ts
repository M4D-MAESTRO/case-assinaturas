import { PerfisModule } from './../../modules/perfis/perfis.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Perfil } from '../../modules/perfis/entities/perfil.entity';
import { SharedService } from './shared.service';
import { Notificacao } from '../../modules/notificacoes/entities/notificacoe.entity';
import { PlanosRepository } from './../../modules/assinatura-module/planos/repositories/implementations/PlanosRepository';
import { ItensDePlanosRepository } from './../../modules/assinatura-module/item-de-planos/repositories/implementations/ItensDePlanosRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil, Notificacao]), PerfisModule],
  providers: [
    SharedService,
    PlanosRepository,
    ItensDePlanosRepository,
  ],
  exports: [SharedService]
})
export class SharedModule { }
