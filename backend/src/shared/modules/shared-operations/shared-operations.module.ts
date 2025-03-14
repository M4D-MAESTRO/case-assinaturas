import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedOperationsService } from './shared-operations.service';
import { SharedModule } from '../shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), SharedModule],
  providers: [SharedOperationsService],
  exports: [SharedOperationsService]
})
export class SharedOperationsModule { }
