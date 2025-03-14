import { Test, TestingModule } from '@nestjs/testing';
import { ItemDePlanosService } from './item-de-planos.service';

describe('ItemDePlanosService', () => {
  let service: ItemDePlanosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemDePlanosService],
    }).compile();

    service = module.get<ItemDePlanosService>(ItemDePlanosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
