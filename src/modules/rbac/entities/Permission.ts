import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Action } from './Action';
import { Resource } from './Resource';
import { RolePermission } from './RolePermission';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
@Index(['name'], { unique: true })
export class Permission extends BaseEntity {
  // 命名规则：<resource>.<action>[.<field列表或*>][.<条件key或*>]
  // 用户资源的读写全权	user.readWrite.*.*
  // 只读 user.email	user.read.email
  // 仅能更新自己的资料	user.update.*.owner
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  @Column('text', { array: true, nullable: true })
  fields?: string[]; // ['email', 'phone']

  // { "ownerOnly": true }
  @Column({ type: 'jsonb', nullable: true })
  condition?: Record<string, unknown>;

  @ManyToOne(() => Action, action => action.permissions, { nullable: false })
  action!: Action;

  @ManyToOne(() => Resource, resource => resource.permissions, {
    nullable: false,
  })
  resource!: Resource;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  rolePermissions!: RolePermission[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
