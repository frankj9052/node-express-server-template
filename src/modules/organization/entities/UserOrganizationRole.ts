import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from './Organization';
import { User } from '@modules/user/entities/User';
import { Role } from '@modules/rbac/entities/Role';

@Entity()
@Unique('UQ_uor_user-org', ['user', 'organization', 'role'])
export class UserOrganizationRole extends BaseEntity {
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
}
