import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfisService } from './perfis.service';
import { PerfisController } from './perfis.controller';
import { Perfil } from './entities/perfil.entity';
import { PerfisRepository } from './repositories/implementations/PerfisRepository';
import { IsUniqueNomeConstraint } from './validations/IsUniqueNome';
import { CaslModule } from '../../shared/authorizations/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil]), CaslModule],
  controllers: [PerfisController],
  providers: [PerfisService, PerfisRepository, IsUniqueNomeConstraint],
  exports: [PerfisService, PerfisRepository],
})
export class PerfisModule { }
