import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Public } from './config/public-endpoint.config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getSystemInfo', () => {
    it('should return system information', async () => {
      const expectedInfo = {
        api: `${process.env.SYSTEM_NICKNAME} - ${process.env.SYSTEM_NAME}`,
        env: process.env.MODE,
        version: process.env.SYSTEM_VERSION,
        status: 'UP',
      };

      const systemInfo = await appController.getSystemInfo();

      expect(systemInfo).toEqual(expectedInfo);
    });
  });
});
