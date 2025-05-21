import { NotAuthorizedError } from '@modules/common/errors/NotAuthorizedError';
import { createLoggerWithContext } from '@modules/common/lib/logger';
import { User } from '@modules/user/entities/User';
import AppDataSource from 'config/data-source';
import { verifyPassword } from './utils/password';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';
import { UserOrganizationRole } from '@modules/organization/entities/UserOrganizationRole';
import { In } from 'typeorm';
import { RolePermission } from '@modules/rbac/entities/RolePermission';
import { UserPayload } from './types/UserPayload';

const logger = createLoggerWithContext('AuthService');

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private userOrgRoleRepo = AppDataSource.getRepository(UserOrganizationRole);
  private rolePermissionRepo = AppDataSource.getRepository(RolePermission);

  async login(email: string, password: string): Promise<UserPayload> {
    const log = logger.child({ method: 'login', email });
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !user.password) {
      log.warn(`User ${email} not exist`);
      throw new NotAuthorizedError('login', { email });
    }

    const isMatch = await verifyPassword(user.password, password);

    if (!isMatch) {
      log.warn(`User ${email} password not match`);
      throw new UnauthorizedError();
    }

    if (!user.isActive) {
      log.warn(`User ${email} is disabled`);
      throw new UnauthorizedError('Account is disabled');
    }

    if (!user.emailVerified) {
      log.warn(`User ${email} email not verified`);
      throw new UnauthorizedError('Email not verified');
    }

    const payload = await this.buildUserPayload(user);

    log.info(`User ${email} login successfully`);
    return payload;
  }
  private async buildUserPayload(user: User): Promise<UserPayload> {
    // 1. 查询用户在所有组织中的角色
    const orgRoles = await this.userOrgRoleRepo.find({
      where: { user: { id: user.id } },
      relations: ['organization', 'role'],
    });

    const roleIds = orgRoles.map(orgRole => orgRole.role.id);

    // 2. 查询所有 RolePermission（其中 permission.name 已是标准权限表达式）
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { role: { id: In(roleIds) } },
      relations: ['role', 'permission'],
    });

    // 3. 构建 roleId -> permissionStrings 映射
    const permissionMap = new Map<string, string[]>();

    for (const rp of rolePermissions) {
      const roleId = rp.role.id;
      const permName = rp.permission.name;

      if (!permissionMap.has(roleId)) permissionMap.set(roleId, []);
      permissionMap.get(roleId)!.push(permName);
    }

    // 4. 构造最终 orgRoles[] 附带权限表达式
    const formattedOrgRoles = orgRoles.map(orgRole => ({
      orgId: orgRole.organization.id,
      orgName: orgRole.organization.name,
      roleCode: orgRole.role.code,
      roleName: orgRole.role.name,
      permissionStrings: permissionMap.get(orgRole.role.id) ?? [],
    }));

    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
      orgRoles: formattedOrgRoles,
      sessionVersion: user.sessionVersion,
    };
  }

  async getUserPayloadById(userId: string): Promise<UserPayload> {
    const log = logger.child({ method: 'getUserPayloadById', userId });

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      log.warn(`User not found`);
      throw new NotAuthorizedError('User not found', { userId });
    }
    return this.buildUserPayload(user);
  }
}
