import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { logger } from './logger';

/**
 * BaseSeeder 提供统一的日志记录、子类 context、可选 shouldRun 实现
 */
export abstract class BaseSeeder implements Seeder {
  protected readonly logger;

  constructor() {
    // 默认 context 为类名，如 Seeder:CreateAdminUser
    this.logger = logger.child({ context: `Seeder:${this.constructor.name}` });
  }
  /**
   * 可选方法签名（不是属性）
   */
  shouldRun?(dataSource: DataSource): Promise<boolean>;

  /**
   * 必须实现：真正的执行逻辑
   */
  abstract run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void>;
}
