import { Module } from '@nestjs/common';
import { CargaDadosSocketService } from './carga-dados-socket.service';
import { CargaDadosSocketGateway } from './carga-dados-socket.gateway';
import { SharedModule } from '../../../shared/modules/shared.module';

@Module({
  imports: [SharedModule],
  providers: [CargaDadosSocketGateway, CargaDadosSocketService],
  exports: [CargaDadosSocketGateway, CargaDadosSocketService],
})
export class CargaDadosSocketModule {}
