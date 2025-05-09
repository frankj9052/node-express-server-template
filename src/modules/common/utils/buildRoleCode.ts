/**
 * 构建组织作用域下的角色唯一标识符。
 *
 * 格式为：`{orgId}::{roleName}`
 * 例如：`ORG123::admin`
 *
 * 用途：
 * - 唯一标识某个组织内部的角色
 * - 适用于多租户 RBAC 模型中，组织可自定义角色但仍需全局唯一识别
 * - 可用于权限模型、角色分配、缓存、审计等场景
 *
 * 命名约定：
 * - `orgId` 建议使用统一格式（如 ORG 开头）
 * - `roleName` 建议使用小写、无空格、无特殊字符（如 'admin', 'doctor'）
 *
 * @param orgId - 组织唯一标识（如 ORG123）
 * @param roleName - 角色名称（保持原始格式，建议为小写字母）
 * @returns 构建后的角色标识字符串
 */
export const buildRoleCode = (orgId: string, roleName: string): string => `${orgId}::${roleName}`;
