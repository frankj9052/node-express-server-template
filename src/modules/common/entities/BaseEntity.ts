import { User } from '@modules/user/entities/User';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('identity')
  id!: string;

  /** 审计字段 —— 自动写入 */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  /** 操作者（逻辑外键）—— 当用户被物理删除时仍保留字符串 */
  @ManyToOne(() => User, { nullable: true })
  createdByUser?: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  updatedByUser?: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  deletedByUser?: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deletedBy?: string;
}
