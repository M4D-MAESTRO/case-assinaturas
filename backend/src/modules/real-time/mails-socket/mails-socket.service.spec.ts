import { Test, TestingModule } from '@nestjs/testing';
import { MailsSocketService } from './mails-socket.service';

describe('MailsSocketService', () => {
  let service: MailsSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailsSocketService],
    }).compile();

    service = module.get<MailsSocketService>(MailsSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
