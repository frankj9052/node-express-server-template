import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@modules/common/entities/BaseEntity';

@Entity()
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
