import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";   // ✅ ADDED
import { Product } from "../../types/Product";

type CartItem = Product & { quantity: number };

type CartState = {
  userId: string | null;   // already present
  items: Product[];
};

const initialState: CartState = {
  userId: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ✅ NEW ACTION — set which user is logged in
    setCartUser: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.items = []; // clear previous user's cart
    },

    // ✅ NEW ACTION — load items from AsyncStorage
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

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

      // ✅ SAVE TO ASYNC STORAGE FOR THIS USER
      if (state.userId) {
        AsyncStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;

      // ✅ SAVE CHANGE
      if (state.userId) {
        AsyncStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      }
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;

      // ✅ SAVE CHANGE
      if (state.userId) {
        AsyncStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);

      // ✅ SAVE CHANGE
      if (state.userId) {
        AsyncStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      }
    },

    toggleCartItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id);

      if (existing) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // ✅ SAVE CHANGE
      if (state.userId) {
        AsyncStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
      }
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  toggleCartItem,
  setCartUser,        // ✅ export
  setCartItems,       // ✅ export
} = cartSlice.actions;

export default cartSlice.reducer;
