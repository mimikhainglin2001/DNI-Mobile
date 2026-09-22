import axios from "axios";

import { ENV } from "@/core/config/env";

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  parentId?: string | null;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  categoryId: string;
  orderedQuantity?: number;
}

type CategoryResponse = {
  data?: CatalogCategory[];
  items?: CatalogCategory[];
};

type GraphQLResponse = {
  data?: {
    catalogProducts?: {
      items: Array<{
        productId: string;
        title: string;
        price: number;
        images?: string[];
        imageUrl?: string;
        categoryId: string;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

type TopOrderedResponse = {
  items?: Array<{
    productId: string;
    title: string;
    imageUrl?: string;
    price?: number | string;
    orderedQuantity: number;
  }>;
};

const productClient = axios.create({
  baseURL: ENV.PRODUCT_SERVICE_URL,
  timeout: 10000,
});

const ecommerceReadClient = axios.create({
  baseURL: ENV.ECOMMERCE_READ_SERVICE_URL,
  timeout: 10000,
});

const catalogProductsQuery = `
  query CatalogProducts($page: Int!, $limit: Int!) {
    catalogProducts(page: $page, limit: $limit) {
      items {
        productId
        title
        price
        images
        imageUrl
        categoryId
      }
    }
  }
`;

function unwrap<T>(payload: T | { data: T }): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

function toAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const base = ENV.PRODUCT_SERVICE_URL.replace(/\/api\/v\d+\/?$/i, "");
  return `${base}/uploads/${path.replace(/^\/?(uploads\/)?/, "")}`;
}

export const catalogApi = {
  async getCategories(): Promise<CatalogCategory[]> {
    const response = await productClient.get<CategoryResponse>("/categories", {
      params: { page: 1, limit: 100 },
    });
    return response.data.data ?? response.data.items ?? [];
  },

  async getProducts(): Promise<CatalogProduct[]> {
    const response = await ecommerceReadClient.post<GraphQLResponse>(
      "/graphql",
      {
        query: catalogProductsQuery,
        variables: { page: 1, limit: 20 },
      },
    );

    const payload = response.data;
    const graphQLError = payload.errors?.[0]?.message;
    if (graphQLError) throw new Error(graphQLError);

    return (payload.data?.catalogProducts?.items ?? []).map((item) => ({
      id: item.productId,
      name: item.title,
      price: Number(item.price ?? 0),
      images: [...(item.images ?? []), item.imageUrl]
        .map((image) => toAssetUrl(image))
        .filter(Boolean) as string[],
      categoryId: item.categoryId,
    }));
  },

  async getTopOrderedProducts(): Promise<CatalogProduct[]> {
    const response = await ecommerceReadClient.get<TopOrderedResponse>(
      "/catalog/products/top-ordered",
      { params: { limit: 10 } },
    );

    const payload = unwrap(response.data);
    return (payload.items ?? []).map((item) => ({
      id: item.productId,
      name: item.title,
      price: Number(item.price ?? 0),
      images: [toAssetUrl(item.imageUrl)].filter(Boolean) as string[],
      categoryId: "",
      orderedQuantity: item.orderedQuantity,
    }));
  },
};
