import apiClient, { CustomAxiosRequestConfig } from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  profile_completed: boolean;
}

export const getUserDisplayName = (
  accessToken: string,
  email: string,
): string => {
  try {
    const payload = accessToken.split(".")[1];
    if (payload) {
      const claims = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      ) as Record<string, unknown>;
      const claimName =
        claims.name ??
        claims.full_name ??
        claims.given_name ??
        claims.preferred_username;

      if (typeof claimName === "string" && claimName.trim()) {
        return claimName.trim();
      }
    }
  } catch {
    // Some access tokens are opaque and do not contain readable profile claims.
  }

  return email.split("@")[0]?.trim() || "My Account";
};

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  gender: number;
  address: string;
  pin: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  profile_completed: boolean;
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

export const register = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload,
    {
      skipAuth: true,
    } as CustomAxiosRequestConfig,
  );

  return response.data;
};
