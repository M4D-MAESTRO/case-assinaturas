import { Test, TestingModule } from '@nestjs/testing';
import { TemplateCargasController } from './template-cargas.controller';
import { TemplateCargasService } from './template-cargas.service';

describe('TemplateCargasController', () => {
  let controller: TemplateCargasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateCargasController],
      providers: [TemplateCargasService],
    }).compile();

    controller = module.get<TemplateCargasController>(TemplateCargasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
