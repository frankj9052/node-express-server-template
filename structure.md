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
├── package-lock.json
├── package.json
├── scripts
│   ├── generateTree.ts
│   └── tsconfig.scripts.json
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
│   │   ├── errorHandler.ts
│   │   └── sessionMiddleware.ts
│   ├── migrations
│   ├── modules
│   │   ├── auth
│   │   │   └── entities
│   │   ├── common
│   │   │   ├── entities
│   │   │   │   └── BaseEntity.ts
│   │   │   ├── enums
│   │   │   │   ├── ActionScope.enum.ts
│   │   │   │   ├── gender.enum.ts
│   │   │   │   ├── honorific.enum.ts
│   │   │   │   └── role.enum.ts
│   │   │   └── utils
│   │   │       ├── buildPermissionName.ts
│   │   │       └── path.ts
│   │   ├── organization
│   │   │   ├── entities
│   │   │   │   ├── Organization.ts
│   │   │   │   └── UserOrganizationRole.ts
│   │   │   ├── organization.controller.ts
│   │   │   ├── organization.service.ts
│   │   │   ├── routes.ts
│   │   │   └── __test__
│   │   │       └── organization.route.test.ts
│   │   ├── rbac
│   │   │   ├── entities
│   │   │   │   ├── Action.ts
│   │   │   │   ├── Permission.ts
│   │   │   │   ├── Resource.ts
│   │   │   │   ├── Role.ts
│   │   │   │   └── RolePermission.ts
│   │   │   ├── rbac.controller.ts
│   │   │   ├── rbac.service.ts
│   │   │   ├── routes.ts
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
│   │       │   ├── user-prod.seed.ts
│   │       │   └── user.seed.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── __test__
│   │           └── user.route.test.ts
│   ├── server.ts
│   ├── swagger
│   │   ├── swagger.ts
│   │   └── swaggerOptions.ts
│   └── test
│       └── setup.ts
├── structure.md
└── tsconfig.json

```