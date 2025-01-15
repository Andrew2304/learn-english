import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonWord } from './entities/lesson-word.entity';
import { LessonQuestion } from './entities/lesson-question.entity';
import { LessonAnswer } from './entities/lesson-answer.entity';
import { Word } from '../words/entities/word.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    TypeOrmModule.forFeature([LessonWord]),
    TypeOrmModule.forFeature([LessonQuestion]),
    TypeOrmModule.forFeature([LessonAnswer]),
    TypeOrmModule.forFeature([Word]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
