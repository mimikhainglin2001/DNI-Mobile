// Only refresh-token request

import axios from "axios";

import { ENV } from "../config/env";

export const refreshClient = axios.create({
  baseURL: ENV.API_URL,

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Unwrap the backend's `{ data, meta }` envelope
 * so callers read the payload directly (`res.data`).
 */
refreshClient.interceptors.response.use((response) => {
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    response.data = response.data.data;
  }

  return response;
});
