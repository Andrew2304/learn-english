import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { LessonQuestion } from './lesson-question.entity';

@Entity()
export class LessonAnswer extends BaseEntity {
  @Column({ type: 'int', name: 'question_id' })
  public questionId: number;

  @Column({ type: 'text', name: 'answer', nullable: true })
  public answer: string | null;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @OneToOne(() => LessonQuestion)
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  lessonQuestion: LessonQuestion | null;
}
