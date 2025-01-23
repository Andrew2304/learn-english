import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { In, Like, Repository } from 'typeorm';
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
  async create(
    createLessonDto: CreateLessonDto,
    userId: number,
  ): Promise<number> {
    const code = dayjs().format('YYYYMMDD');
    let number: number = 1;
    const preLesson = await this.lessonsRepository.findOne({
      where: { title: Like(`${code}%`), userId },
    });

    if (preLesson) {
      number = +preLesson.title.split('-')[1] + 1;
    }
    const lesson = await this.lessonsRepository.save({
      userId,
      topic: createLessonDto.topic?.toLowerCase(),
      description: createLessonDto.description,
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
        pronunciationLink: item?.pronunciationLink,
        translation: item?.translation?.toLowerCase(),
      });
    }

    return lesson?.id;
  }

  async update(
    id: number,
    updateLessonDto: CreateLessonDto,
    userId: number,
  ): Promise<number | null> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id, userId },
      relations: ['lessonWords'],
    });

    if (!lesson) return null;

    const words = lesson.lessonWords;
    const inputWords = updateLessonDto.words;

    const deleteWords: any[] = words.filter((item1) =>
      inputWords.every((item2) => item1?.id !== item2?.id),
    );
    const insertWords = inputWords.filter((item1) => !item1?.id);
    const updateWords = inputWords.filter((item1) =>
      words.some((item2) => item1?.id === item2?.id),
    );

    // delete
    await this.lessonWordsRepository.softDelete({
      lessonId: id,
      id: In(deleteWords.map((item: any) => item.id)),
    });

    // update lesson
    await this.lessonsRepository.update(id, {
      ...lesson,
      lessonWords: undefined,
      description: updateLessonDto.description,
    });

    // insert words
    for (const word of insertWords) {
      const wordDB = await this.wordsRepository.findOne({
        where: { name: word.description },
      });

      await this.lessonWordsRepository.save({
        wordId: wordDB?.id,
        lessonId: lesson.id,
        description: word.description?.toLowerCase(),
        type: word?.type,
        pronunciation: word?.pronunciation?.toLowerCase(),
        pronunciationLink: word?.pronunciationLink,
        translation: word?.translation?.toLowerCase(),
      });
    }

    // update words
    for (const word of updateWords) {
      await this.lessonWordsRepository.update(word.id, {
        ...word,
      });
    }

    return lesson?.id;
  }

  async findAll(userId: number) {
    return await this.lessonsRepository.find({
      where: { userId },
      relations: [
        'lessonWords',
        'lessonWords.lessonQuestions',
        'lessonWords.lessonQuestions.lessonAnswer',
      ],
      order: { id: 'DESC' },
    });
  }
  async findTopics(userId: number) {
    return await this.lessonsRepository
      .createQueryBuilder('lesson')
      .where('lesson.userId = :userId', { userId })
      .select('lesson.topic', 'topic')
      .groupBy('lesson.topic')
      .getRawMany();
  }

  async findOne(id: number, userId: number) {
    return await this.lessonsRepository.findOne({
      where: { id, userId },
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
    userId: number,
  ): Promise<number | OnErrorEventHandlerNonNull> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id, userId },
      relations: ['lessonWords'],
    });

    if (!lesson) return null;

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
        pronunciationLink: content.pronunciationLink,
      });
      await this.lessonAnswersRepository.save({
        questionId: question?.id,
        answer: content.answer,
      });
    }

    // await this.lessonWordsRepository.update(id, {
    //   count: updateLessonDto.typeCount,
    // });

    return id;
  }
}
