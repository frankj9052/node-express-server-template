import dotenvFlow from "dotenv-flow";

// 环境变量加载与配置管理
dotenvFlow.config();

export const env = {
    PORT: process.env.PORT || 3000
}
