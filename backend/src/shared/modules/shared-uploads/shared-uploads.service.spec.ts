import { Test, TestingModule } from '@nestjs/testing';
import { SharedUploadsService } from './shared-uploads.service';

describe('SharedUploadsService', () => {
  let service: SharedUploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedUploadsService],
    }).compile();

    service = module.get<SharedUploadsService>(SharedUploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
