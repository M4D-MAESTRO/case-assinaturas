import { Injectable } from '@nestjs/common';
import {
    HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator,
    DiskHealthIndicator, MemoryHealthIndicator, HealthCheckResult, 
} from '@nestjs/terminus';

@Injectable()
export class HealthService {

    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly db: TypeOrmHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
    ) { }

    async checkAll() {
        const checks: HealthCheckResult[] = [];
        checks.push(await this.checkPing());
        checks.push(await this.checkDatabase());
        checks.push(await this.checkDisk());
        checks.push(await this.checkMemory());

        return checks;
    }

    checkPing() {
        return this.health.check([
            () => this.http.pingCheck('ping-check-google', 'https://www.google.com/'),
        ]);
    }

    checkDatabase() {
        return this.health.check([
            () => this.db.pingCheck('postgres-db'),
        ]);
    }

    checkDisk() {
        return this.health.check([
            () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.5 }),
        ]);
    }

    checkMemory() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
        ]);
    }

}
