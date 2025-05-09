// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { env } from 'config/env';

// interface UserPayload {
//   id: string;
//   userName: string;
//   email: string;
//   emailVerified: boolean;
//   profileCompleted: boolean;
//   isActive: boolean;

//   // 所属组织 + 角色 + 权限（可多个）
//   orgRoles: {
//     orgId: string;
//     orgName: string;
//     roleId: string;
//     roleName: string;
//     permissions: {
//       permissionId: string;
//       permissionName: string;
//       fields: string[];
//       condition: Record<string, unknown>;
//       resource: {
//         resourceId: string;
//         resourceName: string;
//       };
//       actions: {
//         actionId: string;
//         actionName: string;
//       }[];
//     }[];
//   }[];
// }

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload;
//     }
//   }
// }

// export const currentUser = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.session?.jwt;

//   if (!token) return next();

//   try {
//     const payload = jwt.verify(token, env.JWT_SECRET) as UserPayload;
//     req.currentUser = payload;
//   } catch (err) {
//     console.warn('❌ 无法解析 JWT:', err);
//   }

//   return next();
// };
