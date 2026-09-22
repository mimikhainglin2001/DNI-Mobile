import { injectable } from "tsyringe";

import { refreshClient } from "@/core/network/refresh-client";

@injectable()
export class AuthRefreshApi {
  async refreshToken(refreshToken: string) {
    return refreshClient.post("/api/v1/refresh", {
      refreshToken,
    });
  }
}
