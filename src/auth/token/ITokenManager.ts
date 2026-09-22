import type { UserEntity } from "@/domain/entities/user.entity";

export interface ITokenManager {
  saveTokens(accessToken: string, refreshToken?: string): Promise<void>;

  saveUser(user: UserEntity): Promise<void>;

  getAccessToken(): Promise<string | null>;

  getRefreshToken(): Promise<string | null>;

  getUser(): Promise<UserEntity | null>;

  clear(): Promise<void>;
}
