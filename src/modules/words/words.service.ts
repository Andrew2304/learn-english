import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { parseWordDefinition } from '../../helpers';
import { Word } from './entities/word.entity';
import { History } from '../histories/entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @InjectRepository(History)
    private historiesRepository: Repository<History>,
  ) {}
  async create(createWordDto: CreateWordDto) {
    return await this.wordsRepository.save({ ...createWordDto });
  }

  async findAll(takeQuery: number, skipQuery: number) {
    const take = takeQuery || 10;
    const skip = skipQuery || 0;
    const [result, total] = await this.wordsRepository.findAndCount({
      where: {
        isActive: true,
        isVerify: true,
        pronunciationLink: Not(IsNull()),
      },
      order: { name: 'ASC' },
      take,
      skip,
    });

    const ids: number[] = result.map(item => item.id);
    const histories = await this.historiesRepository.find({
      where: {
        wordId: In(ids),
      }
    });

    return {
      data: result.map(item => (
        {
          ...item,
          listen: histories.find(item1 => item.id === item1.wordId && item1.type === "LISTEN"),
          write: histories.find(item1 => item.id === item1.wordId && item1.type === "WRITE"),
        })),
      count: total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  async update(id: number, updateWordDto: UpdateWordDto) {
    return await this.wordsRepository.save({ ...updateWordDto });
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }

  async handCsv(filePath: string): Promise<boolean> {
    let data = await this.readCsv(filePath);

    data = data.filter(
      (item) =>
        !!item['BUT FIRST, ENGLISH!'] &&
        item['BUT FIRST, ENGLISH!']?.length > 10 &&
        !item['BUT FIRST, ENGLISH!'].includes('BUT FIRST, ENGLISH!') &&
        !item['BUT FIRST, ENGLISH!'].includes('Level A1 Vocabulary Wordlist'),
    );

    const wordRows = data.filter((item) =>
      item['BUT FIRST, ENGLISH!'].includes('('),
    );
    // const exampleRows = data.filter((item) =>
    //   item['BUT FIRST, ENGLISH!'].includes('Example:'),
    // );
    // const translationRows = data.filter((item) =>
    //   item['BUT FIRST, ENGLISH!'].includes('Translation:'),
    // );

    for (const wordRow of wordRows) {
      const word = parseWordDefinition(wordRow['BUT FIRST, ENGLISH!']);

      if (word) {
        // rows.push(word);
        await this.create(word as CreateWordDto);
      }
    }

    // console.log('exampleRows', exampleRows.length);
    // console.log('translationRows', translationRows.length);

    return true;
  }

  async syncSound(): Promise<boolean> {
    const words = await this.wordsRepository.find({
      where: {
        isVerify: false,
        pronunciationLink: IsNull(),
      },
    });

    for (const word of words) {
      const pronunciationLink = await this.getSound(word.name);
      if (pronunciationLink) {
        await this.update(word.id, {
          ...word,
          isVerify: true,
          pronunciationLink,
        } as CreateWordDto);
      }
    }

    return true;
  }

  // private functions
  private async readCsv(filePath: string): Promise<any[]> {
    const rows = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve(rows))
        .on('error', (error) => reject(error));
    });
  }

  private async getSound(word: string): Promise<string | undefined> {
    if (!word || typeof word === 'number') return null;
    const url = `https://dict.laban.vn/ajax/getsound?accent=us&word=${word}`;
    const res = await axios.get(url);

    if (res.status === 200) {
      return res?.data?.data;
    } else {
      console.log('Error getSound', url);
      return undefined;
    }
  }
}
