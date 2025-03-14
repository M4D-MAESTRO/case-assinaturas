import { Test, TestingModule } from '@nestjs/testing';
import { CartaoClientesService } from './cartao-clientes.service';

describe('CartaoClientesService', () => {
  let service: CartaoClientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartaoClientesService],
    }).compile();

    service = module.get<CartaoClientesService>(CartaoClientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
