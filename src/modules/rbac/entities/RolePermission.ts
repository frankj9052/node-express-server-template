import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './Role';
import { Permission } from './Permission';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
export class RolePermission extends BaseEntity {
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /* 外键 */
  @ManyToOne(() => Permission, permission => permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission!: string;

  @ManyToOne(() => Role, role => role.rolePermissions, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: string;
}
