import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";
import { Product } from "../types";

export interface ProductListResponse {
  count: number;
  products: Product[];
}

export const getProducts = async (
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  const response = await apiClient.get<ProductListResponse>(
    API_ENDPOINTS.PRODUCTS.LIST,
    { signal },
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
