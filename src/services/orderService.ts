import { isAxiosError } from "axios";
import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";
import { ProductVariant } from "../types";

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variant_id: string;
  variant: ProductVariant;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  status: string;
  total_amount: string;
  shipping_address: string;
  shipping_pin: string;
  created_at: string;
  items: OrderItem[];
}

export interface BuyNowOrderItem {
  parent_id: number;
  variant_id: string;
  quantity: number;
}

export interface BuyNowCheckoutItem extends BuyNowOrderItem {
  productName: string;
  unitPrice: number;
  originalPrice: number;
}

export type CheckoutSource = "cart" | "product-details";

export const placeOrder = async (addressId: number): Promise<Order> => {
  const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS.LIST, {
    address_id: addressId,
  });
  return response.data;
};

export const placeBuyNowOrder = async (
  addressId: number,
  items: BuyNowOrderItem[],
): Promise<Order> => {
  const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS.BUY_NOW, {
    address_id: addressId,
    items,
  });
  return response.data;
};

export const getOrders = async (signal?: AbortSignal): Promise<Order[]> => {
  const response = await apiClient.get<Order[] | { orders: Order[] }>(
    API_ENDPOINTS.ORDERS.LIST,
    { signal },
  );
  return Array.isArray(response.data) ? response.data : response.data.orders;
};

export const getOrderErrorMessage = (error: unknown): string => {
  if (isAxiosError<{ detail?: string; message?: string }>(error)) {
    const message =
      error.response?.data?.detail ?? error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return error instanceof Error
    ? error.message
    : "Unable to complete your order. Please try again.";
};
