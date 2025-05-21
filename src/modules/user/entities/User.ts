import { BaseEntity } from '@modules/common/entities/BaseEntity';
import { Gender } from '@modules/common/enums/gender.enum';
import { Honorific } from '@modules/common/enums/honorific.enum';
import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  userName!: string;

  @Index({ unique: true }) // 唯一索引
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string; // 加密后存储（注意生产环境要加盐处理）

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (!this.password) return;

    // 避免重复 hash（已加密的 password 通常以 "$argon2" 开头）
    if (this.password.startsWith('$argon2')) return;

    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id, // 更强的算法
      memoryCost: 2 ** 16, // 使用更多内存
      timeCost: 5, // 更多计算迭代
      parallelism: 1, // 单线程，防止资源争用
    });
  }

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
  profileCompleted!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255 })
  sessionVersion!: string;

  /**
   * sessionVersion 用于控制用户所有 session 的失效。
   * 改变此字段可让旧 session token（或 Redis session）全部失效。
   */
  @BeforeInsert()
  private setDefaultSessionVersion(): void {
    if (!this.sessionVersion) {
      this.sessionVersion = uuidv4();
    }
  }
}
