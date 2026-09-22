import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface ErrorResponse {
  message?: string;
  errorCode?: string;
  detail?: string;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const logApiRequest = (method: string, url: string, data?: unknown) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(`[API REQUEST] ${method.toUpperCase()} ${url}`, data ?? "");
};

const logApiResponse = (url: string, status: number, data?: unknown) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(`[API RESPONSE] ${status} - ${url}`, data ?? "");
};

const logApiError = (url: string, error: AxiosError<ErrorResponse>) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`[API ERROR] ${url}`, error.response?.data ?? error.message);
};

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomAxiosRequestConfig;

    if (!customConfig.skipAuth) {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    logApiRequest(config.method ?? "GET", config.url ?? "", config.data);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logApiResponse(response.config.url ?? "", response.status, response.data);

    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    logApiError(error.config?.url ?? "", error);

    if (error.response?.status === 401) {
      console.warn("[AUTH] Unauthorized request");

      // Token refresh / logout logic can be added here later.
    }

    return Promise.reject(error);
  },
);

export default apiClient;
