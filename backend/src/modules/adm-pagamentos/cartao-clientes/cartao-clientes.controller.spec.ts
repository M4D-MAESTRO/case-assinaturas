import { Test, TestingModule } from '@nestjs/testing';
import { CartaoClientesController } from './cartao-clientes.controller';
import { CartaoClientesService } from './cartao-clientes.service';

describe('CartaoClientesController', () => {
  let controller: CartaoClientesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartaoClientesController],
      providers: [CartaoClientesService],
    }).compile();

    controller = module.get<CartaoClientesController>(CartaoClientesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
