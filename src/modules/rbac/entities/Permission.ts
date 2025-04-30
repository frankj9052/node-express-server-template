import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Action } from './Action';
import { Resource } from './Resource';
import { RolePermission } from './RolePermission';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description!: string;

  // 表示resource中哪些field可以访问，null表示可以操作整个resource, 这里的type到底用string好还是说有更好的选择，比如array
  @Column({ type: 'varchar', length: 255, nullable: true })
  field?: string;

  // 表示访问条件，比如ownerOnly等等，这里有没有更好的type，比如enum
  @Column({ type: 'varchar', length: 255, nullable: true })
  condition?: string;

  @ManyToOne(() => Action)
  action!: Action;

  @ManyToOne(() => Resource)
  resource!: Resource;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission, { eager: true })
  rolePermissions!: RolePermission[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
