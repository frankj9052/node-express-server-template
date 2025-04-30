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
│   ├── controllers
│   │   └── test.controller.ts
│   ├── database
│   │   ├── entities
│   │   │   ├── Action.ts
│   │   │   ├── BaseEntity.ts
│   │   │   ├── Organization.ts
│   │   │   ├── Permission.ts
│   │   │   ├── Resource.ts
│   │   │   ├── Role.ts
│   │   │   ├── RolePermission.ts
│   │   │   ├── User.ts
│   │   │   └── UserOrganizationRole.ts
│   │   ├── factories
│   │   ├── migrations
│   │   └── seeds
│   │       └── user.seeder.ts
│   ├── enums
│   │   ├── ActionScope.enum.ts
│   │   ├── gender.enum.ts
│   │   ├── honorific.enum.ts
│   │   └── role.enum.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   │   └── sessionMiddleware.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── v1
│   │       ├── index.ts
│   │       ├── public.ts
│   │       ├── test.ts
│   │       └── __tests__
│   │           └── test.route.test.ts
│   ├── server.ts
│   ├── services
│   ├── swagger
│   │   ├── swagger.ts
│   │   └── swaggerOptions.ts
│   ├── test
│   │   └── setup.ts
│   └── utils
│       ├── connectDatabase.ts
│       ├── connectRedis.ts
│       └── path.ts
├── structure.md
└── tsconfig.json

```
