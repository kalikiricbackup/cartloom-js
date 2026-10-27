import { isAxiosError } from "axios";
import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";
import { ProductVariant } from "../types";

export interface CartItem {
  item_id: number;
  product_id: number;
  product_name: string;
  variant_id: string;
  variant: ProductVariant;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface CartResponse {
  count: number;
  items: CartItem[];
  cart_total: string;
}

export const getCart = async (signal?: AbortSignal): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>(API_ENDPOINTS.CART.LIST, {
    signal,
  });

  return response.data;
};

export interface UpdateCartItemQuantityRequest {
  quantity: number;
}

export const updateCartItemQuantity = async (
  itemId: number,
  payload: UpdateCartItemQuantityRequest,
): Promise<CartResponse> => {
  const response = await apiClient.patch<CartResponse>(
    API_ENDPOINTS.CART.ITEM_BY_ID(itemId),
    payload,
  );

  return response.data;
};

export interface RemoveCartItemResponse extends CartResponse {
  message: string;
}

export const removeCartItem = async (
  itemId: number,
): Promise<RemoveCartItemResponse> => {
  const response = await apiClient.delete<RemoveCartItemResponse>(
    API_ENDPOINTS.CART.ITEM_BY_ID(itemId),
  );

  return response.data;
};

export const getCartErrorMessage = (error: unknown): string => {
  if (isAxiosError<{ detail?: string; message?: string }>(error)) {
    const message =
      error.response?.data?.detail ?? error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Unable to load your cart. Please try again.";
};

export interface AddToCartRequest {
  parentId: number;
  variant_id: string;
  quantity: number;
}

export interface AddToCartResponse {
  message: string;
  item_id: number;
  count: number;
  items: Array<{
    item_id: number;
    product_id: number;
    product_name: string;
    variant_id: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
  cart_total: string;
}

export const addItemToCart = async (
  payload: AddToCartRequest,
): Promise<AddToCartResponse> => {
  const response = await apiClient.post<AddToCartResponse>(
    API_ENDPOINTS.CART.ITEMS,
    payload,
  );

  return response.data;
};
