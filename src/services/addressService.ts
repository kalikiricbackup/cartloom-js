import { isAxiosError } from "axios";
import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";

export interface Address {
  id: number;
  label: string;
  address: string;
  street: string;
  city: string;
  state: string;
  pin: string;
  created_at: string;
}

export type AddressUpdateRequest = Omit<Address, "created_at">;

export interface CreateAddressRequest {
  street: string;
  city: string;
  state: string;
  pin: string;
  label: string;
}

interface AddressApiError {
  message?: string;
  detail?: string | Array<{ msg?: string }>;
}

export const getAddresses = async (
  signal?: AbortSignal,
): Promise<Address[]> => {
  const response = await apiClient.get<Address[]>(
    API_ENDPOINTS.ADDRESSES.LIST,
    {
      signal,
    },
  );

  return response.data;
};

export const createAddress = async (
  address: CreateAddressRequest,
): Promise<Address> => {
  const response = await apiClient.post<Address>(
    API_ENDPOINTS.ADDRESSES.LIST,
    address,
  );

  return response.data;
};

export const updateAddress = async (
  address: AddressUpdateRequest,
): Promise<Address> => {
  const response = await apiClient.patch<Address>(
    API_ENDPOINTS.ADDRESSES.BY_ID(address.id),
    address,
  );

  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADDRESSES.BY_ID(id));
};

export const getAddressErrorMessage = (error: unknown): string => {
  if (isAxiosError<AddressApiError>(error)) {
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
    : "Unable to complete this address request. Please try again.";
};
