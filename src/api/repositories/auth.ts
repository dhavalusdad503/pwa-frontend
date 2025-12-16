import { LoginCredentials } from "@api/auth";
import { BaseApiClient } from "@api/BaseApiClient";


export class AuthRepository extends BaseApiClient {
  private readonly basePath = '/auth';

  constructor() {
    super();
  }

  async login(credentials: LoginCredentials) {
    const data = credentials;
    return this.post(`${this.basePath}/login`, data);
  }

  async validateToken(params: { token: string | null }) {
    return this.get(`${this.basePath}/validate-token`, { params });
  }

  async resetPassword(data: {
    token: string | null;
    new_password: string;
  }) {
    return this.post(`${this.basePath}/reset-password`, data);
  }

  async forgotPassword(data: { email: string }) {
    return this.post(`${this.basePath}/forgot-password`, data);
  }

  async refreshToken(data: { refreshToken?: string }) {
    return this.post(`${this.basePath}/refresh-token`, data);
  }
}

export const authRepository = new AuthRepository();