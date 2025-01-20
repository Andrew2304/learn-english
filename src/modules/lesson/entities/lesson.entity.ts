import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { LessonWord } from './lesson-word.entity';

@Entity()
export class Lesson extends BaseEntity {
  @Column({ type: 'int', name: 'user_id' })
  public userId: number;

  @Column({ type: 'text', name: 'topic' })
  public topic: string;

  @Column({ type: 'text', name: 'title' })
  public title: string;

  @Column({ type: 'int', name: 'count', default: 1 })
  public count: number;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @OneToMany(() => LessonWord, (type: LessonWord) => type.lesson, {
    cascade: true,
  })
  lessonWords: LessonWord[];
}
