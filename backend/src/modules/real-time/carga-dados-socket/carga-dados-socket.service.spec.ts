import { Test, TestingModule } from '@nestjs/testing';
import { CargaDadosSocketService } from './carga-dados-socket.service';

describe('CargaDadosSocketService', () => {
  let service: CargaDadosSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargaDadosSocketService],
    }).compile();

    service = module.get<CargaDadosSocketService>(CargaDadosSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
