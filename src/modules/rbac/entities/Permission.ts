import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Resource } from './Resource';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
@Index(['name'], { unique: true })
export class Permission extends BaseEntity {
  // 命名规则：buildPermissionName
  @Column({ type: 'varchar', length: 512 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column('text', { array: true, nullable: true })
  fields?: string[]; // ['email', 'phone']

  // { "ownerOnly": true }
  @Column({ type: 'jsonb', nullable: true })
  condition?: Record<string, unknown>;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
