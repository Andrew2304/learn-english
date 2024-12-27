import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm';
import { HistoryDetail } from './entities/history-detail.entity';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(History)
    private historiesRepository: Repository<History>,
    @InjectRepository(HistoryDetail)
    private historyDetailRepository: Repository<HistoryDetail>,
  ) {}
  async create(createHistoryDto: CreateHistoryDto) {
    let history = await this.historiesRepository.findOne({
      where: {
        userId: 1,
        wordId: createHistoryDto.wordId,
        type: createHistoryDto.type
      }
    });

    if (!history) {
      history = await this.historiesRepository.save({ ...createHistoryDto, userId: 1 });
    } else {
      await this.historiesRepository.update(history.id, { count: history.count + 1 });
    }

    await this.historyDetailRepository.save({ historyId: history.id });
    return true;
  }

  findAll() {
    return `This action returns all histories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
