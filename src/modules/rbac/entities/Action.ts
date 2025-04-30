import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Permission } from './Permission';

@Entity()
export class Action extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Permission, permission => permission.action, { eager: true })
  permissions!: Permission[];
}
