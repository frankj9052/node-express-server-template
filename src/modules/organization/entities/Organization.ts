import { Column, Entity, OneToMany } from 'typeorm';
import { UserOrganizationRole } from './UserOrganizationRole';
import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Role } from '@modules/rbac/entities/Role';

@Entity()
export class Organization extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  /* 关系 */
  @OneToMany(() => UserOrganizationRole, uor => uor.organization)
  userOrganizationRoles!: UserOrganizationRole[];

  @OneToMany(() => Role, role => role.organization)
  roles!: Role[];
}
