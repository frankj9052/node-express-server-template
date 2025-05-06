import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Action extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
