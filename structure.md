```plaintext
├── .env
├── .env.development
├── .env.example
├── .env.production
├── .gitignore
├── .husky
│   └── pre-commit
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── jest.config.cjs
├── logs
│   ├── .6d1f175736eeb1d938a9f3a7c77eb600c09aa67d-audit.json
│   └── 2025-05-12.log
├── package-lock.json
├── package.json
├── scripts
│   ├── argon2Test.ts
│   └── generateTree.ts
├── src
│   ├── app.ts
│   ├── config
│   │   ├── corsOptions.ts
│   │   ├── data-source.ts
│   │   ├── env.ts
│   │   ├── rollup.config.js
│   │   └── sessionOptions.ts
│   ├── infrastructure
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── loaders
│   │   └── registerRoutes.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   │   ├── currentUser.ts
│   │   ├── errorHandler.ts
│   │   ├── requestId.ts
│   │   └── sessionMiddleware.ts
│   ├── migrations
│   │   └── 1746819937753-AutoMigration.ts
│   ├── modules
│   │   ├── auth
│   │   │   └── entities
│   │   ├── common
│   │   │   ├── constants
│   │   │   │   ├── system-actions.ts
│   │   │   │   ├── system-organizations.ts
│   │   │   │   ├── system-permissions.ts
│   │   │   │   ├── system-resources.ts
│   │   │   │   └── system-role.ts
│   │   │   ├── entities
│   │   │   │   └── BaseEntity.ts
│   │   │   ├── enums
│   │   │   │   ├── gender.enum.ts
│   │   │   │   └── honorific.enum.ts
│   │   │   ├── errors
│   │   │   │   ├── BadRequestError.ts
│   │   │   │   ├── BaseError.ts
│   │   │   │   ├── DatabaseConnectionError.ts
│   │   │   │   ├── FileNotFoundError.ts
│   │   │   │   ├── InternalServerError.ts
│   │   │   │   ├── InvocationError.ts
│   │   │   │   ├── NotAuthorizedError.ts
│   │   │   │   ├── NotFoundError.ts
│   │   │   │   ├── UnauthorizedError.ts
│   │   │   │   └── ValidationError.ts
│   │   │   ├── lib
│   │   │   │   ├── ConditionalSeeder.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── safeCreateEnum.ts
│   │   │   └── utils
│   │   │       ├── buildPermissionName.ts
│   │   │       ├── buildRoleCode.ts
│   │   │       ├── buildRolePermissionName.ts
│   │   │       ├── buildUserOrgRoleName.ts
│   │   │       ├── loadSeeders.ts
│   │   │       ├── path.ts
│   │   │       ├── runSeedersInOrder.ts
│   │   │       └── waitForEntity.ts
│   │   ├── organization
│   │   │   ├── entities
│   │   │   │   ├── Organization.ts
│   │   │   │   └── UserOrganizationRole.ts
│   │   │   ├── factories
│   │   │   │   └── organization.factory.ts
│   │   │   ├── organization.controller.ts
│   │   │   ├── organization.service.ts
│   │   │   ├── routes.ts
│   │   │   ├── seeds
│   │   │   │   ├── 01-organization-prod.seed.ts
│   │   │   │   └── 08-userOrgnizationRole-prod.seed.ts
│   │   │   ├── utils
│   │   │   └── __test__
│   │   │       └── organization.route.test.ts
│   │   ├── rbac
│   │   │   ├── entities
│   │   │   │   ├── Action.ts
│   │   │   │   ├── Permission.ts
│   │   │   │   ├── PermissionAction.ts
│   │   │   │   ├── Resource.ts
│   │   │   │   ├── Role.ts
│   │   │   │   └── RolePermission.ts
│   │   │   ├── rbac.controller.ts
│   │   │   ├── rbac.service.ts
│   │   │   ├── routes.ts
│   │   │   ├── seeds
│   │   │   │   ├── 02-action-prod.seed.ts
│   │   │   │   ├── 03-resource-prod.seed.ts
│   │   │   │   ├── 04-permission-prod.seed.ts
│   │   │   │   ├── 05-role-prod.seed.ts
│   │   │   │   └── 06-rolePermission-prod.seed.ts
│   │   │   └── __test__
│   │   │       └── rbac.route.test.ts
│   │   ├── test
│   │   │   ├── routes.ts
│   │   │   ├── test.controller.ts
│   │   │   └── __tests__
│   │   │       └── test.route.test.ts
│   │   └── user
│   │       ├── dto
│   │       ├── entities
│   │       │   └── User.ts
│   │       ├── factories
│   │       │   └── user.factory.ts
│   │       ├── routes.ts
│   │       ├── seeds
│   │       │   ├── 07-user-prod.seed.ts
│   │       │   └── user.seed.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── __test__
│   │           └── user.route.test.ts
│   ├── server.ts
│   ├── swagger
│   │   ├── swagger.ts
│   │   └── swaggerOptions.ts
│   ├── test
│   │   └── setup.ts
│   └── types
│       └── express
│           └── index.d.ts
├── structure.md
└── tsconfig.json

```
