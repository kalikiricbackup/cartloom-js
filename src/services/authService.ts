import apiClient, { CustomAxiosRequestConfig } from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export interface LoginRequest {
  // Add the exact fields from your Swagger API
}

export interface LoginResponse {
  // Add the exact response fields from your Swagger API
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload,
    {
      skipAuth: true,
    } as CustomAxiosRequestConfig,
  );

  return response.data;
};
