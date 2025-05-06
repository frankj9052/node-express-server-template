import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Column, Entity, Index } from 'typeorm';
import { ActionScope } from '@modules/common/enums/ActionScope.enum';

@Entity()
export class Action extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name!: string;

  @Column({ type: 'enum', enum: ActionScope, default: ActionScope.GLOBAL })
  scope!: ActionScope;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
