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

  WISHLIST: {
    LIST: "/wishlist",
    BY_PRODUCT_ID: (id: number) => `/wishlist/${id}`,
  },

  ADDRESSES: {
    LIST: "/addresses",
    BY_ID: (id: number) => `/addresses/${id}`,
  },
};
