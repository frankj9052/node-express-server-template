import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './Role';
import { Permission } from './Permission';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
export class RolePermission extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /* 外键 */
  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
