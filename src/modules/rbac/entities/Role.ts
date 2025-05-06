import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from '@modules/organization/entities/Organization';

@Entity()
@Index(['name', 'organization'], { unique: true })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /* 外键 */
  @ManyToOne(() => Organization, { nullable: true })
  organization!: Organization; // null 表示全局角色
}
