import {
  verifyEmailUseCase,
  resendVerificationUseCase,
} from "@/core/di/container";

import { TokenManager } from "@/auth/token/TokenManager";
import { useAuthStore } from "@/auth/store/auth.store";

const tokenManager = new TokenManager();

export class VerifyEmailViewModel {
  async verify(
    verificationId: string,
    otp: string,
    email: string,
    password: string,
  ) {
    const result = await verifyEmailUseCase.execute(
      verificationId,
      otp,
      email,
      password,
    );

    if (!result.success) {
      return result;
    }

    await tokenManager.saveTokens(
      result.data!.accessToken,
      result.data!.refreshToken,
    );

    await tokenManager.saveUser(result.data!.user);

    useAuthStore.getState().login(result.data!.user);

    return result;
  }

  async resend(email: string) {
    return resendVerificationUseCase.execute(email);
  }
}
