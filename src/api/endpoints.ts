export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
  },

  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: number) => `/products/${id}`,
  },

  HOME: "/home",
};
