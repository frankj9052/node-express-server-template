import { Column, Entity, ManyToOne } from 'typeorm';
import { Permission } from './Permission';
import { Action } from './Action';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
export class PermissionAction extends BaseEntity {
  @ManyToOne(() => Permission, { nullable: false })
  permission!: Permission;

  @ManyToOne(() => Action, { nullable: false })
  action!: Action;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
