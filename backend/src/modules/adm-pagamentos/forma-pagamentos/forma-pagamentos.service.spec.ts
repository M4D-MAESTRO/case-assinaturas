import { Test, TestingModule } from '@nestjs/testing';
import { FormaPagamentosService } from './forma-pagamentos.service';

describe('FormaPagamentosService', () => {
  let service: FormaPagamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormaPagamentosService],
    }).compile();

    service = module.get<FormaPagamentosService>(FormaPagamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
