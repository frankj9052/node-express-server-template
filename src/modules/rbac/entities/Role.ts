import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from '@modules/organization/entities/Organization';

@Entity()
@Index(['name', 'organization'], { unique: true })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'SET NULL' })
  organization!: Organization;
}
