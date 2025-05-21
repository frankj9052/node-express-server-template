import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from './Organization';
import { User } from '@modules/user/entities/User';
import { Role } from '@modules/rbac/entities/Role';
import { buildFullUserOrgRoleName } from '@modules/codecs/permissionCodec';

@Entity()
@Index('IDX_uor_name', ['name'], { unique: true })
export class UserOrganizationRole extends BaseEntity {
  @Column({ type: 'varchar', length: 512, nullable: false })
  name!: string;

  /* 外键 */
  @ManyToOne(() => User, { nullable: false })
  @Index()
  user!: User;

  @ManyToOne(() => Organization, { nullable: false })
  @Index()
  organization!: Organization;

  @ManyToOne(() => Role, { nullable: false })
  @Index()
  role!: Role;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  private setName(): void {
    if (!this.user?.id || !this.organization?.id || !this.role?.id) return;
    this.name = buildFullUserOrgRoleName(this.user.id, this.organization.id, this.role.code);
  }
}
