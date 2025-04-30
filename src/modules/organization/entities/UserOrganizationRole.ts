import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { Organization } from './Organization';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { User } from '@modules/user/entities/User';
import { Role } from '@modules/rbac/entities/Role';

@Entity()
@Unique('UQ_uor_user-org', ['user', 'organization'])
export class UserOrganizationRole extends BaseEntity {
  /* 外键 */
  @ManyToOne(() => User, user => user.organizationRoles, { eager: true })
  @Index()
  user!: User;

  @ManyToOne(() => Organization, org => org.userOrganizationRoles, { eager: true })
  @Index()
  organization!: Organization;

  @ManyToOne(() => Role, role => role.userOrganizationRoles, { eager: true })
  @Index()
  role!: Role;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
