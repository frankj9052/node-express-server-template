import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Gender } from '@modules/common/enums/gender.enum';
import { Honorific } from '@modules/common/enums/honorific.enum';
import { UserOrganizationRole } from '@modules/organization/entities/UserOrganizationRole';
import { Entity, Column, Index, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  userName!: string;

  @Index({ unique: true }) // 唯一索引
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string; // 加密后存储（注意生产环境要加盐处理）

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender!: Gender;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateOfBirth!: Date;

  @Column({ type: 'enum', enum: Honorific, nullable: true })
  honorific!: Honorific;

  /* OAuth */
  @Column({ type: 'varchar', length: 100, nullable: true })
  oauthProvider?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  oauthId?: string;

  /* 业务状态 */
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarImage!: string;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'boolean', default: true })
  profileComplete!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /* 关系 */
  @OneToMany(() => UserOrganizationRole, uor => uor.user, { eager: true })
  organizationRoles!: UserOrganizationRole[];
}
