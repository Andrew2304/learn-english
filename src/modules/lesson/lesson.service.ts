import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { In, Like, Repository } from 'typeorm';
import { USER_ID } from '../../helpers';
import { Word } from '../words/entities/word.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonAnswer } from './entities/lesson-answer.entity';
import { LessonQuestion } from './entities/lesson-question.entity';
import { LessonWord } from './entities/lesson-word.entity';
import { Lesson } from './entities/lesson.entity';

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
    const code = dayjs().format('YYYYMMDD');
    let number: number = 1;
    const preLesson = await this.lessonsRepository.findOne({
      where: { title: Like(`${code}%`) },
    });

    console.log(preLesson);

    if (preLesson) {
      number = +preLesson.title.split('-')[1] + 1;
    }
    const lesson = await this.lessonsRepository.save({
      userId: USER_ID,
      topic: createLessonDto.topic?.toLowerCase(),
      title: `${code}-${number}`,
      count: createLessonDto.words?.length,
    });

    for (const item of createLessonDto.words) {
      const wordDB = await this.wordsRepository.findOne({
        where: { name: item.description },
      });

      await this.lessonWordsRepository.save({
        wordId: wordDB?.id,
        lessonId: lesson.id,
        description: item.description?.toLowerCase(),
        type: item?.type?.toLowerCase(),
        pronunciation: item?.pronunciation?.toLowerCase(),
        translation: item?.translation?.toLowerCase(),
      });
    }

    return lesson?.id;
  }

  async update(id: number, updateLessonDto: CreateLessonDto): Promise<number> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['lessonWords'],
    });

    const words: string[] = lesson?.lessonWords?.map(
      (item) => item.description,
    );
    const inputWords: string[] = updateLessonDto.words?.map(
      (item) => item.description,
    );

    const deleteWords = words.filter((item) => !inputWords.includes(item));
    const insertWords = inputWords.filter((item) => !words.includes(item));

    // delete
    await this.lessonWordsRepository.softDelete({
      lessonId: id,
      description: In(deleteWords),
    });

    // insert
    for (const word of insertWords) {
      const wordDB = await this.wordsRepository.findOne({
        where: { name: word },
      });

      const inputWord = updateLessonDto.words.find(
        (item) => item.description === word,
      );

      await this.lessonWordsRepository.save({
        wordId: wordDB?.id,
        lessonId: lesson.id,
        description: word,
        type: inputWord?.type,
        pronunciation: inputWord?.pronunciation,
        translation: inputWord?.translation,
      });
    }

    return lesson?.id;
  }

  async findAll() {
    return await this.lessonsRepository.find({
      relations: [
        'lessonWords',
        'lessonWords.lessonQuestions',
        'lessonWords.lessonQuestions.lessonAnswer',
      ],
      order: { id: 'DESC' },
    });
  }
  async findTopics() {
    return await this.lessonsRepository
      .createQueryBuilder('lesson')
      .select('lesson.topic', 'topic')
      .groupBy('lesson.topic')
      .getRawMany();
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

  async updateQuestions(
    id: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<number> {
    // delete
    const lessonWordIds: number[] = updateLessonDto.contents.map(
      (item: any) => item.lessonWordId,
    );
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
