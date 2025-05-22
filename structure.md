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
│   ├── argon2Test.ts
│   └── generateTree.ts
├── src
│   ├── app.ts
│   ├── config
│   │   ├── corsOptions.ts
│   │   ├── data-source.ts
│   │   ├── env.ts
│   │   ├── openapiRegistry.ts
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
│   │   └── 1747839781001-AutoMigration.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto
│   │   │   │   └── login.dto.ts
│   │   │   ├── entities
│   │   │   ├── middlewares
│   │   │   │   └── requireAuth.ts
│   │   │   ├── routes.ts
│   │   │   ├── types
│   │   │   │   └── UserPayload.ts
│   │   │   └── utils
│   │   │       └── password.ts
│   │   ├── codecs
│   │   │   └── permissionCodec.ts
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
│   │   │   │   ├── BaseSeeder.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── safeCreateEnum.ts
│   │   │   ├── middlewares
│   │   │   │   └── validateRequest.ts
│   │   │   └── utils
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
│   │   ├── service-auth
│   │   │   ├── client
│   │   │   │   ├── RedisServiceTokenStore.ts
│   │   │   │   └── ServiceClient.ts
│   │   │   ├── docs
│   │   │   │   ├── openapi.ts
│   │   │   │   └── service-auth-architecture-doc.md
│   │   │   ├── jwks
│   │   │   │   └── jwks.service.ts
│   │   │   ├── keys
│   │   │   │   ├── private.pem
│   │   │   │   └── public.pem
│   │   │   ├── middlewares
│   │   │   │   ├── requireServiceAuth.ts
│   │   │   │   └── requireServiceJwt.ts
│   │   │   ├── routes.ts
│   │   │   ├── serviceAuth.controller.ts
│   │   │   ├── serviceToken.service.ts
│   │   │   └── utils
│   │   │       ├── keyLoader.ts
│   │   │       └── verifyWithJwks.ts
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
│   │   └── swagger.ts
│   ├── test
│   │   └── setup.ts
│   └── types
│       └── express
│           └── index.d.ts
├── structure.md
└── tsconfig.json

```
