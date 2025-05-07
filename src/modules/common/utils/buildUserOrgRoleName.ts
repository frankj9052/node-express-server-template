export const buildFullUserOrgRoleName = (email: string, orgName: string, roleName: string) =>
  `${email}::${orgName}:${roleName}`;
