import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { History } from '../../histories/entities/history.entity';

@Entity()
@Unique('UNIQUE_WORD', ['name', 'deletedAt'])
export class Word extends BaseEntity {
  @Column({ type: 'text', name: 'name', nullable: false })
  public name: string;

  @Column({ type: 'text', name: 'type', nullable: true })
  public type: string | null;

  @Column({ type: 'text', name: 'pronunciation', nullable: true })
  public pronunciation: string | null;

  @Column({ type: 'text', name: 'translation', nullable: true })
  public translation: string | null;

  @Column({ type: 'text', name: 'pronunciation_link', nullable: true })
  public pronunciationLink: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'is_verify', default: false })
  isVerify: boolean;

  @Column({ type: 'text', name: 'example', nullable: true })
  public example: string | null;

  @Column({ type: 'text', name: 'example_translation', nullable: true })
  public exampleTranslation: string | null;

  @Column({ type: 'text', name: 'description', nullable: true })
  public description: string | null;

  @Column({ type: 'int', name: 'order_number', nullable: false, default: 100 })
  public orderNumber: number;

  @OneToMany(() => History, (type: History) => type.word, {
    cascade: true,
  })
  histories: History[];
}
