export interface UserPayload {
  id: string;
  userName?: string;
  email?: string;
  emailVerified?: boolean;
  profileCompleted?: boolean;
  isActive?: boolean;

  orgRoles: {
    orgId: string;
    orgName: string;
    roleCode: string;
    roleName: string;
    permissionStrings: string[];
  }[];

  sessionVersion: string;
}
