import { Test, TestingModule } from '@nestjs/testing';
import { ItemDePlanosController } from './item-de-planos.controller';
import { ItemDePlanosService } from './item-de-planos.service';

describe('ItemDePlanosController', () => {
  let controller: ItemDePlanosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemDePlanosController],
      providers: [ItemDePlanosService],
    }).compile();

    controller = module.get<ItemDePlanosController>(ItemDePlanosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
