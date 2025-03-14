
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../../shared/authorizations/casl/casl.module';

import { ItemDePlanosService } from './item-de-planos.service';
import { ItemDePlanosController } from './item-de-planos.controller';
import { ItemDePlano } from './entities/item-de-plano.entity';
import { ItensDePlanosRepository } from './repositories/implementations/ItensDePlanosRepository';
import { ItensPlanos } from '../itens-planos/entities/itens-planos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemDePlano, ItensPlanos]),
    CaslModule,
  ],
  controllers: [ItemDePlanosController],
  providers: [ItemDePlanosService, ItensDePlanosRepository],
  exports: [ItemDePlanosService, ItensDePlanosRepository],
})
export class ItemDePlanosModule { }
