import { Test, TestingModule } from '@nestjs/testing';
import { TemplateCargasService } from './template-cargas.service';

describe('TemplateCargasService', () => {
  let service: TemplateCargasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateCargasService],
    }).compile();

    service = module.get<TemplateCargasService>(TemplateCargasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
