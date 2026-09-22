export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },

  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: number) => `/products/${id}`,
  },
};
