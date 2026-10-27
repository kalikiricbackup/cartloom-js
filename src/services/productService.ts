import { isAxiosError } from "axios";
import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";
import { Product } from "../types";

export interface ProductListResponse {
  count: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  products: Product[];
}

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  page_size?: number;
  sort?: string;
}

export interface WishlistItem {
  wishlist_item_id: number;
  product_id: number;
  variant_id: string;
  variant: Product["variants"][number];
  product: Product;
}

export interface WishlistResponse {
  count: number;
  items: WishlistItem[];
}

export const getProducts = async (
  params: ProductQueryParams,
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  const response = await apiClient.get<ProductListResponse>(
    API_ENDPOINTS.PRODUCTS.LIST,
    { params, signal },
  );

  return response.data;
};

export const getProductById = async (
  id: number,
  signal?: AbortSignal,
): Promise<Product> => {
  const response = await apiClient.get<Product>(
    API_ENDPOINTS.PRODUCTS.BY_ID(id),
    { signal },
  );

  return response.data;
};

export const getWishlist = async (
  signal?: AbortSignal,
): Promise<WishlistResponse> => {
  const response = await apiClient.get<WishlistResponse>(
    API_ENDPOINTS.WISHLIST.LIST,
    { signal },
  );

  return response.data;
};

export interface AddToWishlistRequest {
  product_id: number;
  variant_id: string;
}

export interface AddToWishlistResponse {
  message: string;
  wishlist_item_id: number;
  product_id: number;
  variant_id: string;
}

interface WishlistApiError {
  message?: string;
  detail?: string | Array<{ msg?: string }>;
}

export const getWishlistErrorMessage = (error: unknown): string => {
  if (isAxiosError<WishlistApiError>(error)) {
    const { detail, message } = error.response?.data ?? {};
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      const detailMessage = detail
        .map((item) => item.msg)
        .filter((item): item is string => Boolean(item))
        .join(" ");
      if (detailMessage) {
        return detailMessage;
      }
    }
    if (message) {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Unable to update your wishlist. Please try again.";
};

export const addProductToWishlist = async (
  payload: AddToWishlistRequest,
): Promise<AddToWishlistResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Your login session has expired. Please sign in again.");
  }

  const response = await apiClient.post<AddToWishlistResponse>(
    API_ENDPOINTS.WISHLIST.LIST,
    {
      product_id: payload.product_id,
      variant_id: payload.variant_id,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

export const removeProductFromWishlist = async (
  productId: number,
): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.WISHLIST.BY_PRODUCT_ID(productId));
};
