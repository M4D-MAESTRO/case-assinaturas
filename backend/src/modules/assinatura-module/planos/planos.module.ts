

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../../../shared/authorizations/casl/casl.module';
import { PlanosService } from './planos.service';
import { PlanosController } from './planos.controller';
import { Plano } from './entities/plano.entity';
import { UsersModule } from './../../users/users.module';
import { PlanosRepository } from './repositories/implementations/PlanosRepository';
import { SharedModule } from './../../../shared/modules/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plano]), CaslModule, forwardRef(() => UsersModule),
    forwardRef(() => SharedModule)
  ],
  controllers: [PlanosController],
  providers: [PlanosService, PlanosRepository],
  exports: [PlanosService, PlanosRepository],
})
export class PlanosModule { }
