import { injectable, inject } from "tsyringe";

import {
  IUserRepository,
  RegisterResult,
  ForgotPasswordResult,
  VerifyForgotPasswordResult,
} from "@/domain/repositories/user.repository";

import { UserEntity } from "@/domain/entities/user.entity";

import { AuthResponseEntity } from "@/domain/entities/auth-response.entity";

import { AuthApi } from "../api/auth.api";
import { Result } from "@/core/utils/result";
import { getApiError } from "@/core/network/api-error";

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @inject("AuthApi")
    private api: AuthApi,
  ) {}

  async login(email: string, password: string) {
    try {
      const res = await this.api.login(email, password);

      const accessToken = res.data.access_token;

      /*
       * Immediately use the newly received
       * access token to retrieve the user.
       */
      const me = await this.api.getMe(accessToken);

      const user = new UserEntity(
        me.data.user.id,
        me.data.user.name,
        me.data.user.email,
      );

      /*
       * The backend returns the refresh token
       * via HttpOnly cookie only, so the mobile
       * client has no refresh token available.
       */
      const auth = new AuthResponseEntity(user, accessToken, "");

      return Result.ok(auth);
    } catch (error) {
      return Result.fail<AuthResponseEntity>(getApiError(error));
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const res = await this.api.register(name, email, password);

      /*
       * Backend verification is email-OTP based and does not
       * return a verificationId; the user id is used as the
       * navigation handle passed to the verify screen.
       */
      const verificationId = String(res.data.user?.id ?? "");

      return Result.ok({
        verificationId,
      } as RegisterResult);
    } catch (error) {
      return Result.fail<RegisterResult>(getApiError(error));
    }
  }

  async verifyEmail(
    verificationId: string,
    otp: string,
    email: string,
    password: string,
  ) {
    try {
      await this.api.verifyEmail(otp);

      return this.login(email, password);
    } catch (error) {
      return Result.fail<AuthResponseEntity>(getApiError(error));
    }
  }

  async resendVerification(email: string) {
    try {
      await this.api.resendVerification(email);

      return Result.ok(true);
    } catch (error) {
      return Result.fail<boolean>(getApiError(error));
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.api.forgotPassword(email);

      return Result.ok({
        verificationId: email,
      } as ForgotPasswordResult);
    } catch (error) {
      return Result.fail<ForgotPasswordResult>(getApiError(error));
    }
  }

  async resendForgotPassword(email: string) {
    try {
      await this.api.forgotPassword(email);

      return Result.ok({
        verificationId: email,
      } as ForgotPasswordResult);
    } catch (error) {
      return Result.fail<ForgotPasswordResult>(getApiError(error));
    }
  }

  async verifyForgotPassword(verificationId: string, otp: string) {
    /*
     * The backend has no intermediate "verify reset code" step:
     * the 6-digit code from the email IS the password reset token,
     * so it is passed straight through to the reset step.
     */
    return Result.ok({
      resetToken: otp,
      expiresAt: "",
    } as VerifyForgotPasswordResult);
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    try {
      await this.api.resetPassword(resetToken, newPassword, confirmPassword);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail<void>(getApiError(error));
    }
  }

  async getCurrentUser(): Promise<Result<UserEntity>> {
    try {
      const response = await this.api.getMe();

      const user = new UserEntity(
        response.data.user.id,
        response.data.user.name,
        response.data.user.email,
      );

      return Result.ok(user);
    } catch (error) {
      return Result.fail<UserEntity>(getApiError(error));
    }
  }
}