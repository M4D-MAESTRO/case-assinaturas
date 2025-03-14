import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedUploadsService } from './shared-uploads.service';
import { ArquivosGeraisRepository } from './repositories/implementations/ArquivosGeraisRepository';
import { ArquivoGeral } from './entities/arquivo-geral.entity';
import { SharedModule } from '../shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArquivoGeral]), forwardRef(() => SharedModule),],
  providers: [SharedUploadsService, ArquivosGeraisRepository],
  exports: [SharedUploadsService, ArquivosGeraisRepository],
})
export class SharedUploadsModule { }
