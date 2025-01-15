import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Word } from '../../words/entities/word.entity';

@Entity()
export class History extends BaseEntity {
  @Column({ type: 'int', name: 'word_id' })
  public wordId: number;

  @Column({ type: 'int', name: 'user_id' })
  public userId: number;

  @Column({ type: 'int', name: 'count', default: 1 })
  public count: number;

  @Column({ type: 'text', name: 'type' })
  public type: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @ManyToOne(() => Word)
  @JoinColumn({ name: 'word_id', referencedColumnName: 'id' })
  word: Word | null;
}
