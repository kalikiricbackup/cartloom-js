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
    setWishlistProductIds(state, action: PayloadAction<number[]>) {
      state.productIds = action.payload.filter(
        (productId, index, productIds) =>
          productIds.indexOf(productId) === index,
      );
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
  setWishlistProductIds,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
