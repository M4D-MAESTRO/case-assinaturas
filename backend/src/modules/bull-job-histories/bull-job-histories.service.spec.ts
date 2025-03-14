import { Test, TestingModule } from '@nestjs/testing';
import { BullJobHistoriesService } from './bull-job-histories.service';

describe('BullJobHistoriesService', () => {
  let service: BullJobHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullJobHistoriesService],
    }).compile();

    service = module.get<BullJobHistoriesService>(BullJobHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
