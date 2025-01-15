import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { In, Repository } from 'typeorm';
import { LessonWord } from './entities/lesson-word.entity';
import { LessonQuestion } from './entities/lesson-question.entity';
import { LessonAnswer } from './entities/lesson-answer.entity';
import { USER_ID } from '../../helpers';
import { Word } from '../words/entities/word.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(LessonWord)
    private lessonWordsRepository: Repository<LessonWord>,
    @InjectRepository(LessonQuestion)
    private lessonQuestionsRepository: Repository<LessonQuestion>,
    @InjectRepository(LessonAnswer)
    private lessonAnswersRepository: Repository<LessonAnswer>,
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}
  async create(createLessonDto: CreateLessonDto): Promise<number> {
    const title = '111';
    const lesson = await this.lessonsRepository.save({
      userId: USER_ID,
      topic: createLessonDto.topic,
      title,
      count: createLessonDto.words?.length,
    });

    for (const word of createLessonDto.words) {
      const wordDB = await this.wordsRepository.findOne({
        where: { name: word },
      });

      await this.lessonWordsRepository.save({
        wordId: wordDB?.id,
        lessonId: lesson.id,
        description: word,
      });
    }

    return lesson?.id;
  }

  async findAll() {
    return await this.lessonsRepository.find({
      relations: ['lessonWords'],
    });
  }

  async findOne(id: number) {
    return await this.lessonsRepository.findOne({
      where: { id },
      relations: [
        'lessonWords',
        'lessonWords.lessonQuestions',
        'lessonWords.lessonQuestions.lessonAnswer',
      ],
    });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<number> {
    // delete
    const lessonWords = await this.lessonWordsRepository.find({
      where: { lessonId: id },
    });
    const lessonWordIds: number[] = lessonWords.map((item) => item.id);
    await this.lessonQuestionsRepository.softDelete({
      lessonWordId: In(lessonWordIds),
    });

    // insert
    for (const content of updateLessonDto.contents) {
      const question = await this.lessonQuestionsRepository.save({
        lessonWordId: content.lessonWordId,
        type: content.type,
        question: content.question,
      });
      await this.lessonAnswersRepository.save({
        questionId: question?.id,
        answer: content.answer,
      });
    }

    return id;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
