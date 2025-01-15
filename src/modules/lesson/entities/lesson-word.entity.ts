import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Lesson } from './lesson.entity';
import { Word } from '../../words/entities/word.entity';
import { LessonQuestion } from './lesson-question.entity';

@Entity()
export class LessonWord extends BaseEntity {
  @Column({ type: 'int', name: 'lesson_id' })
  public lessonId: number;

  @Column({ type: 'int', name: 'word_id', nullable: true })
  public wordId: number | null;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  lesson: Lesson | null;

  @OneToOne(() => Word)
  @JoinColumn({ name: 'word_id', referencedColumnName: 'id' })
  word: Word | null;

  @OneToMany(() => LessonQuestion, (type: LessonQuestion) => type.lessonWord, {
    cascade: true,
  })
  lessonQuestions: LessonQuestion[];
}
