import {
  verifyForgotPasswordUseCase,
  resendForgotPasswordUseCase,
} from "@/core/di/container";

export class VerifyForgotPasswordViewModel {
  async verify(verificationId: string, otp: string) {
    return verifyForgotPasswordUseCase.execute(verificationId, otp);
  }

  async resend(email: string) {
    return resendForgotPasswordUseCase.execute(email);
  }
}
