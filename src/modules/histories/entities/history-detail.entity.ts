import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../../base.entity';

@Entity()
export class HistoryDetail extends BaseEntity {
  @Column({ type: 'int', name: 'history_id'})
  public historyId: number;
}
