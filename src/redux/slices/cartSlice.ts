import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const existing = state.items.find(
        item => item.id === action.payload.product.id
      );

      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload.product,
          quantity: action.payload.quantity,
        });
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    // ✅ New toggle action
    toggleCartItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        // Item exists → remove it
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        // Item doesn't exist → add with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    }

  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  toggleCartItem, // export toggle
} = cartSlice.actions;

export default cartSlice.reducer;
