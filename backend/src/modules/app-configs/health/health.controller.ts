
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { Public } from './../../../config/public-endpoint.config';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) {}


  @Public()
  @Get()
  @HealthCheck()
  checkAll() {
    return this.healthService.checkAll();
  }

  @Public()
  @Get('ping')
  @HealthCheck()
  checkPing() {
    return this.healthService.checkPing();
  }

  @Public()
  @Get('database')
  @HealthCheck()
  checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Public()
  @Get('disk')
  @HealthCheck()
  checkDisk() {
    return this.healthService.checkDisk();
  }

  @Public()
  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.healthService.checkMemory();
  }
}