import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { RolePermission } from './RolePermission';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Organization } from '@modules/organization/entities/Organization';
import { UserOrganizationRole } from '@modules/organization/entities/UserOrganizationRole';

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
  @ManyToOne(() => Organization, org => org.roles, { nullable: true })
  organization!: Organization; // null 表示全局角色

  @OneToMany(() => UserOrganizationRole, uor => uor.role, { eager: true })
  userOrganizationRoles!: UserOrganizationRole[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role, { eager: true })
  rolePermissions!: RolePermission[];
}
