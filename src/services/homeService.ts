import apiClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../api/endpoints";
import { HomePageData } from "../types";
 
export const getHomePageData = async (
  signal?: AbortSignal,
): Promise<HomePageData> => {
  const response = await apiClient.get<HomePageData>(API_ENDPOINTS.HOME, {
    signal,
  });
 
  return response.data;
};