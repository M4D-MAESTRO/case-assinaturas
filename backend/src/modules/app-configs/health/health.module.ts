import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TerminusLoggerService } from '../terminus-logger/terminus-logger.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: TerminusLoggerService,
      errorLogStyle: 'pretty',
    }),
    HttpModule
  ],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule { }
