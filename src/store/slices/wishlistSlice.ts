import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: number[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<number>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.filter(
        (productId) => productId !== action.payload,
      );
    },
    toggleWishlistItem(state, action: PayloadAction<number>) {
      const existingIndex = state.productIds.indexOf(action.payload);

      if (existingIndex >= 0) {
        state.productIds.splice(existingIndex, 1);
      } else {
        state.productIds.push(action.payload);
      }
    },
    clearWishlist(state) {
      state.productIds = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
