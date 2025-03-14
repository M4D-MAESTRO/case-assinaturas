import { Test, TestingModule } from '@nestjs/testing';
import { MailsSocketGateway } from './mails-socket.gateway';
import { MailsSocketService } from './mails-socket.service';

describe('MailsSocketGateway', () => {
  let gateway: MailsSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailsSocketGateway, MailsSocketService],
    }).compile();

    gateway = module.get<MailsSocketGateway>(MailsSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
