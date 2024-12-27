import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../../base.entity';

@Entity()
export class History extends BaseEntity {
  @Column({ type: 'int', name: 'word_id'})
  public wordId: number;

  @Column({ type: 'int', name: 'user_id' })
  public userId: number;

  @Column({ type: 'int', name: 'count', default: 1 })
  public count: number;

  @Column({ type: 'text', name: 'type' })
  public type: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;
}
