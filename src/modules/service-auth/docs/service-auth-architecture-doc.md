# 🏗️ Service Auth 架构说明文档

## 🎯 目标

构建一个支持微服务架构的企业级服务间认证系统，具备以下特性：

- 使用 **RS256（非对称加密）** 生成和验证服务 JWT
- 统一签发中心，所有服务使用公钥验证（零信任）
- 支持权限粒度控制（Scope）
- 暴露标准 `.well-known/jwks.json` 接口供所有服务验证 JWT
- 支持 Redis 缓存 Token，提高性能与容错

---

## 📦 模块结构

```
src/modules/service-auth/
├── keys/                         # 私钥/公钥 PEM 文件
│   ├── private.pem
│   └── public.pem
├── jwks/
│   └── jwks.service.ts          # 构造 JWKS JSON 公钥格式
├── middlewares/
│   ├── requireServiceAuth.ts    # 本地公钥验证（用于主服务）
│   └── requireServiceJwt.ts     # 远程 JWKS 验证（用于子服务）
├── utils/
│   ├── keyLoader.ts             # 读取 PEM 文件
│   └── verifyWithJwks.ts        # 使用 jose 验证 JWT
├── client/
│   ├── RedisServiceTokenStore.ts  # Token Redis 缓存
│   └── ServiceClient.ts         # 主服务调用其它服务的客户端
├── serviceToken.service.ts      # JWT 签发 & 本地验证
├── serviceAuth.controller.ts    # service-login & jwks.json 控制器
├── routes.ts                    # 路由注册器
└── docs/
    └── openapi.ts               # OpenAPI 路由文档
```

---

## 🔐 JWT 签发规范

- **算法**：RS256（私钥签发 / 公钥验证）
- **格式**：遵循 OAuth 2.0 / OpenID Connect

### 示例 Payload：

```json
{
  "serviceId": "main-server",
  "scopes": ["write:booking"],
  "iss": "https://auth.noqclinic.dev",
  "aud": "booking-service",
  "iat": 1680000000,
  "exp": 1680003600
}
```

### Header 示例：

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "main-key"
}
```

---

## 🔗 关键接口说明

### POST `/auth/service-login`

- 传入：`serviceId` + `serviceSecret`
- 返回：JWT accessToken
- 示例用途：主服务调用前获取服务 token

### GET `/.well-known/jwks.json`

- 返回当前公钥（用于验证 RS256 token）
- 示例用途：子服务拉取验证用公钥

---

## 🧠 服务端验证方式对比

| 验证方式           | 使用场景                 | 模块                                         |
| ------------------ | ------------------------ | -------------------------------------------- |
| 本地验证（公钥）   | 主服务或内嵌式服务       | `requireServiceAuth.ts`                      |
| 远程 JWKS 拉取验证 | 微服务 / 网关 / API Mesh | `verifyWithJwks.ts` + `requireServiceJwt.ts` |

---

## 🔁 Redis 缓存策略

- `ServiceClient` 在首次获取 token 后写入 Redis：`service-token:<serviceId>`
- 存储内容包含：token 字符串 + 过期时间
- 后续使用缓存，直到即将过期再刷新
- 防止服务重启重复登录，节约请求开销

---

## ✅ 拓展建议

| 能力                | 建议方式                         |
| ------------------- | -------------------------------- |
| 多 Key 支持（轮换） | `kid` + JWKS 多 key 公钥列表     |
| Token 审计 / 注销   | 加入 `jti` 字段 + Redis 黑名单   |
| 多租户隔离          | JWT 增加 `tenantId` + scope 拓展 |
| Web 控制台管理      | 管理每个服务的 scopes / secret   |

---

## 📌 当前环境配置说明

```env
JWT_SERVICE_PRIVATE_KEY_PATH=src/modules/service-auth/keys/private.pem
JWT_SERVICE_PUBLIC_KEY_PATH=src/modules/service-auth/keys/public.pem
JWT_SERVICE_ISSUER=https://auth.noqclinic.dev
```

---

## 📚 依赖库

- `jsonwebtoken` or `jose`：JWT 签发 & 验证
- `zod`：类型安全验证
- `axios`：服务间请求
- `redis`：token 缓存

---

## 🧪 推荐测试方式

| 场景       | 方法                                               |
| ---------- | -------------------------------------------------- |
| JWT 签发   | curl `/auth/service-login` 传入 serviceId + secret |
| JWT 验证   | 模拟 booking-service 携带 token 验证 scope         |
| JWKS 拉取  | GET `.well-known/jwks.json` 验证格式               |
| Redis 缓存 | 重启服务后仍可调用                                 |
