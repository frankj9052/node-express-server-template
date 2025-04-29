import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Gender } from '../../enums/gender.enum';
import { Honorific } from '../../enums/honorific.enum';
import { Role } from './Role';

@Entity('users') // 表名（小写复数，符合惯例）
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // 使用 UUID 更安全，可防止数据顺序推断

  @Index({ unique: true }) // 唯一索引
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password!: string; // 加密后存储（注意生产环境要加盐处理）

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  oauthProvider!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  oauthId!: string;

  // 组合唯一索引，防止oauthProvider+oauthId重复
  @Index(['oauthProvider', 'oauthId'], { unique: true })
  dummyUniqueIndex!: string;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarImage!: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender!: Gender;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateOfBirth!: Date;

  @Column({ type: 'boolean', default: true })
  profileComplete!: boolean;

  @Column({ type: 'enum', enum: Honorific, nullable: true })
  honorific!: Honorific;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken!: string;

  @ManyToMany(() => Role, role => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // 软删除支持
}
