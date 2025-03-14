import { Module } from '@nestjs/common';
import { TemplateCargasService } from './template-cargas.service';
import { TemplateCargasController } from './template-cargas.controller';

@Module({
  controllers: [TemplateCargasController],
  providers: [TemplateCargasService]
})
export class TemplateCargasModule {}
