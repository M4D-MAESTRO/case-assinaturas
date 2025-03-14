import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBullJobHistoryDto } from './dto/create-bullJobHistory.dto';
import { BullJobHistory } from './entities/bullJobHistory.entity';

@Injectable()
export class BullJobHistoriesService {

    constructor(
    @InjectRepository(BullJobHistory)
    private readonly bullJobHistoryRepository: Repository<BullJobHistory>,
    ){}

    async create(dto: CreateBullJobHistoryDto[]){
        const createdBullJobHistory = this.bullJobHistoryRepository.create(dto);
        await this.bullJobHistoryRepository.save(createdBullJobHistory);
    }

}
