import { Test, TestingModule } from '@nestjs/testing';
import { SharedOperationsService } from './shared-operations.service';

describe('SharedOperationsService', () => {
  let service: SharedOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedOperationsService],
    }).compile();

    service = module.get<SharedOperationsService>(SharedOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
