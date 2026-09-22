import { Result } from "@/core/utils/result";

import { AuthResponseEntity } from "../entities/auth-response.entity";
import { UserEntity } from "../entities/user.entity";

export interface RegisterResult {
  verificationId: string;
}

export interface ForgotPasswordResult {
  verificationId: string;
}

export interface VerifyForgotPasswordResult {
  resetToken: string;
  expiresAt: string;
}

export interface IUserRepository {
  login(
    email: string,
    password: string,
  ): Promise<Result<AuthResponseEntity>>;

  register(
    name: string,
    email: string,
    password: string,
  ): Promise<Result<RegisterResult>>;

  verifyEmail(
    verificationId: string,
    otp: string,
    email: string,
    password: string,
  ): Promise<Result<AuthResponseEntity>>;

  resendVerification(
    email: string,
  ): Promise<Result<boolean>>;

  forgotPassword(
    email: string,
  ): Promise<Result<ForgotPasswordResult>>;

  resendForgotPassword(
    email: string,
  ): Promise<Result<ForgotPasswordResult>>;

  verifyForgotPassword(
    verificationId: string,
    otp: string,
  ): Promise<Result<VerifyForgotPasswordResult>>;

  resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<Result<void>>;

  getCurrentUser(): Promise<Result<UserEntity>>;
}
