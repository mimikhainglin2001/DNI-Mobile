import { injectable } from "tsyringe";

import { AuthRefreshApi } from "@/infrastructure/api/auth-refresh.api";

import type { AuthRepository } from "@/domain/repositories/auth.repository";
import type { RefreshTokenResponse } from "@/auth/types";

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authRefreshApi: AuthRefreshApi) {}

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.authRefreshApi.refreshToken(refreshToken);

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token ?? "",
    };
  }
}
