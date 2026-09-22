const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const productServiceUrl =
  process.env.EXPO_PUBLIC_PRODUCT_SERVICE_URL ?? "http://127.0.0.1:5001/api/v1";
const ecommerceReadServiceUrl =
  process.env.EXPO_PUBLIC_ECOMMERCE_READ_SERVICE_URL ?? "http://127.0.0.1:5004";

if (typeof apiUrl !== "string" || apiUrl.trim().length === 0) {
  throw new Error("Missing required environment variable: EXPO_PUBLIC_API_URL");
}

export const ENV = {
  API_URL: apiUrl,
  PRODUCT_SERVICE_URL: productServiceUrl,
  ECOMMERCE_READ_SERVICE_URL: ecommerceReadServiceUrl,
  APP_NAME: "DailyNeedItems",
} as const;
