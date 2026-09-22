import { injectable } from "tsyringe";
import { getApiClient } from "@/core/network/api-client";

@injectable()
export class AuthApi {
  async login(email: string, password: string) {
    return getApiClient().post("/api/v1/login", {
      email,
      password,
    });
  }

  async register(name: string, email: string, password: string) {
    return getApiClient().post("/api/v1/register", {
      name,
      email,
      password,
    });
  }

  async verifyEmail(otp: string) {
    return getApiClient().post("/api/v1/verify-email", {
      token: otp,
    });
  }

  async resendVerification(email: string) {
    return getApiClient().post("/api/v1/verify-email/resend", {
      email,
    });
  }

  async forgotPassword(email: string) {
    return getApiClient().post("/api/v1/forgot-password", {
      email,
    });
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    return getApiClient().post("/api/v1/reset-password", {
      token: resetToken,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  }

  async getMe(accessToken?: string) {
    return getApiClient().get("/api/v1/me", {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });
  }
}