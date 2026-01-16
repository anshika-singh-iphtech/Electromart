import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../../types/Product";

type WishlistState = {
  userId: string | null;   // ✅ added
  items: Product[];
};

const initialState: WishlistState = {
  userId: null,            // ✅ added
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {

    // ✅ NEW — set wishlist user
    setWishlistUser: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      state.items = [];  // clear previous user's wishlist
    },

    // ✅ NEW — load items for this user
    setWishlistItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },

    toggleWishlistItem: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.items.push(action.payload);
      }

      // ✅ SAVE wishlist to async storage per user
      if (state.userId) {
        AsyncStorage.setItem(
          `wishlist_${state.userId}`,
          JSON.stringify(state.items)
        );
      }
    },
  },
});

export const {
  toggleWishlistItem,
  setWishlistUser,     // ✅ export added
  setWishlistItems     // ✅ export added
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
