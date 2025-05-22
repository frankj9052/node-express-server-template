import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from '@modules/organization/entities/Organization';
import { buildRoleCode } from '@modules/codecs/permissionCodec';

@Entity()
@Index(['name', 'organization'], { unique: true })
@Index(['code'], { unique: true })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  code!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  organization!: Organization;

  @BeforeInsert()
  @BeforeUpdate()
  private setCode(): void {
    if (!this.organization?.id || !this.name) return;
    this.code = buildRoleCode(this.organization.id, this.name.toLowerCase());
  }
}
