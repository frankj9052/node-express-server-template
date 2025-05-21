// src/modules/service-auth/client/ServiceClient.ts
import axios, { AxiosInstance } from 'axios';
import { RedisServiceTokenStore } from './RedisServiceTokenStore';

interface ServiceAuthOptions {
  serviceId: string;
  serviceSecret: string;
  authEndpoint: string; // e.g., http://localhost:3100/api/auth/service-login
}

export class ServiceClient {
  private client: AxiosInstance;

  constructor(
    private readonly targetServiceUrl: string,
    private readonly authConfig: ServiceAuthOptions
  ) {
    this.client = axios.create({
      baseURL: targetServiceUrl,
      timeout: 5000,
    });
  }

  private async getToken() {
    const { serviceId, serviceSecret, authEndpoint } = this.authConfig;

    // 1. 从 Redis 缓存读取
    const cached = await RedisServiceTokenStore.get(serviceId);
    const now = Math.floor(Date.now() / 1000);

    if (cached && cached.exp > now + 60) {
      return cached.token;
    }

    // 2. 请求新 token
    const res = await axios.post(authEndpoint, { serviceId, serviceSecret });
    const token = res.data.data.token;
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const exp = payload.exp;

    await RedisServiceTokenStore.set(serviceId, token, exp);

    return token;
  }

  async request<T>(config: Parameters<AxiosInstance['request']>[0]) {
    const token = await this.getToken();

    return this.client.request<T>({
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  get<T>(url: string, config?: any) {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }
}
