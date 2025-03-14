import { Test, TestingModule } from '@nestjs/testing';
import { TerminusLoggerService } from './terminus-logger.service';

describe('TerminusLoggerService', () => {
  let service: TerminusLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerminusLoggerService],
    }).compile();

    service = module.get<TerminusLoggerService>(TerminusLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
