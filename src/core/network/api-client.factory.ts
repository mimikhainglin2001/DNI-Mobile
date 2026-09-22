import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { ENV } from "@/core/config/env";

import type { ITokenManager } from "@/auth/token/ITokenManager";
import type { TokenRefreshCoordinator } from "@/auth/services/token-refresh-coordinator";

import { useAuthStore } from "@/auth/store/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function createApiClient(
  tokenManager: ITokenManager,
  tokenRefreshCoordinator: TokenRefreshCoordinator,
): AxiosInstance {
  const apiClient = axios.create({
    baseURL: ENV.API_URL,

    timeout: 30000,

    headers: {
      "Content-Type": "application/json",
    },
  });

  /*
   * Request interceptor
   *
   * Adds the current access token to every
   * authenticated API request.
   */
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      /*
       * Don't override an explicitly-provided token (e.g. a freshly
       * returned token used by getMe during login). Only fall back to
       * the stored token when the caller didn't supply one.
       */
      if (config.headers.Authorization) {
        return config;
      }

      const token = await tokenManager.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
  );

  /*
   * Response interceptor
   *
   * Handles:
   *
   * 401
   *   ↓
   * refresh token
   *   ↓
   * retry original request
   */
  apiClient.interceptors.response.use(
    (response) => {
      /*
       * The backend wraps every successful response
       * in an envelope `{ data, meta }`. Unwrap it so
       * callers read the payload directly (`res.data`).
       */
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        response.data = response.data.data;
      }

      return response;
    },

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      /*
       * Only handle 401 responses.
       */
      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      /*
       * Prevent infinite refresh loops.
       */
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        /*
         * TokenRefreshCoordinator guarantees
         * that concurrent 401 responses share
         * the same refresh request.
         */
        const newAccessToken = await tokenRefreshCoordinator.refresh();

        /*
         * Replace the expired access token
         * on the original request.
         */
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        /*
         * Retry the original request.
         */
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        /*
         * Refresh failed.
         *
         * Clear invalid authentication data
         * and log out the user.
         */
        await tokenManager.clear();
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    },
  );

  return apiClient;
}
