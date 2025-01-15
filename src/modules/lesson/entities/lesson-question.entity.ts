import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { LessonWord } from './lesson-word.entity';
import { LessonAnswer } from './lesson-answer.entity';
import { EQuestionType } from '../../../helpers';

@Entity()
export class LessonQuestion extends BaseEntity {
  @Column({ type: 'int', name: 'lesson_word_id' })
  public lessonWordId: number;

  @Column({ type: 'enum', name: 'type', enum: EQuestionType })
  public type: EQuestionType;

  @Column({ type: 'text', name: 'question', nullable: true })
  public question: string | null;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @ManyToOne(() => LessonWord)
  @JoinColumn({ name: 'lesson_word_id', referencedColumnName: 'id' })
  lessonWord: LessonWord | null;

  @OneToOne(() => LessonAnswer, (type: LessonAnswer) => type.lessonQuestion, {
    cascade: true,
  })
  lessonAnswer: LessonAnswer[];
}
