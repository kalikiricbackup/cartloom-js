import { isAxiosError } from "axios";
import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export interface UserProfileResponse {
  id: number;
  full_name: string;
  email: string;
  gender: number;
  phone_number: string;
  profile_completed: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
}

export const getCurrentUser = async (
  signal?: AbortSignal,
): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>(
    API_ENDPOINTS.AUTH.CURRENT_USER,
    { signal },
  );

  return response.data;
};

export const updateUserProfile = async (
  payload: UpdateProfileRequest,
): Promise<UserProfileResponse> => {
  const response = await apiClient.patch<UserProfileResponse>(
    API_ENDPOINTS.AUTH.EDIT_PROFILE,
    payload,
  );

  return response.data;
};

export const getProfileErrorMessage = (error: unknown): string => {
  if (isAxiosError<{ detail?: string; message?: string }>(error)) {
    const message =
      error.response?.data?.detail ?? error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Unable to complete your profile request. Please try again.";
};
