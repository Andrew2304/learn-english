import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { HistoryDetail } from './entities/history-detail.entity';
import { Word } from '../words/entities/word.entity';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(History)
    private historiesRepository: Repository<History>,
    @InjectRepository(HistoryDetail)
    private historyDetailRepository: Repository<HistoryDetail>,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}
  async create(createHistoryDto: CreateHistoryDto) {
    let history = await this.historiesRepository.findOne({
      where: {
        userId: 1,
        wordId: createHistoryDto.wordId,
        type: createHistoryDto.type
      }
    });

    if (createHistoryDto.type === "WRITE") {
      await this.historiesRepository.softDelete({
        
        wordId: createHistoryDto.wordId,
        type: "WRITE_ERROR"
      })
    }

    if (!history) {
      history = await this.historiesRepository.save({ ...createHistoryDto, userId: 1 });
    } else {
      await this.historiesRepository.update(history.id, { description: createHistoryDto.description, count: history.count + 1 });
    }

    await this.historyDetailRepository.save({ historyId: history.id, description: createHistoryDto.description});
    return true;
  }

  async summery(takeQuery: number, skipQuery: number) {
    const take = takeQuery || 10;
    const skip = skipQuery || 0;

    const [result, errorTotal] = await this.historiesRepository.findAndCount({
          where: {
            userId: 1,
            type: "WRITE_ERROR"
          },
          relations:["word"],
          take,
          skip,
        });

    const wordTotal = await this.wordsRepository.count({
      where: {
        isActive: true,
        isVerify: true,
        pronunciationLink: Not(IsNull()),
      }
    });
    
    const learnedCount = await this.historiesRepository.count({
        where: {
          userId: 1,
          type: "WRITE"
        }
      });
  
  
    return {
        wordTotal,
        learningCount: wordTotal - learnedCount - errorTotal,
        learnedCount,
        wordErrorData: {
          data: result.map(item => ({...item, ...item.word})),
          total: errorTotal
        }
      };
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
