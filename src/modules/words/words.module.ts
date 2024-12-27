import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from './entities/word.entity';
import { History } from '../histories/entities/history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), TypeOrmModule.forFeature([History])],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
