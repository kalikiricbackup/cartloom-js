import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: number;
  variantId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeCartItem(
      state,
      action: PayloadAction<{ productId: number; variantId: string }>,
    ) {
      state.items = state.items.filter(
        (item) =>
          item.productId !== action.payload.productId ||
          item.variantId !== action.payload.variantId,
      );
    },
    setCartItemQuantity(
      state,
      action: PayloadAction<{
        productId: number;
        variantId: string;
        quantity: number;
      }>,
    ) {
      const item = state.items.find(
        (cartItem) =>
          cartItem.productId === action.payload.productId &&
          cartItem.variantId === action.payload.variantId,
      );

      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addCartItem, removeCartItem, setCartItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
