import { Test, TestingModule } from '@nestjs/testing';
import { CargaDadosSocketGateway } from './carga-dados-socket.gateway';
import { CargaDadosSocketService } from './carga-dados-socket.service';

describe('CargaDadosSocketGateway', () => {
  let gateway: CargaDadosSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargaDadosSocketGateway, CargaDadosSocketService],
    }).compile();

    gateway = module.get<CargaDadosSocketGateway>(CargaDadosSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
