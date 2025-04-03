import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartState, Product, CartItem } from '../../types';
import * as Database from '../../services/database';

const initialState: CartState = {
  items: [],
  isCheckoutVisible: false,
};

// Async thunks for database operations
export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async () => {
    try {
      const items = await Database.getCartItems();
      return items;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [] as CartItem[];
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ product, quantity }: { product: Product; quantity: number }) => {
    try {
      await Database.addToCart(product, quantity);
      return { product, quantity };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId: number) => {
    try {
      await Database.removeFromCart(productId);
      return productId;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    try {
      await Database.updateCartItemQuantity(productId, quantity);
      return { productId, quantity };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async () => {
    try {
      await Database.clearCart();
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Keep the sync reducers for UI operations
    addToCart: (
      state,
      action: PayloadAction<{product: Product; quantity: number}>,
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.product.id === product.id,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: state => {
      state.items = [];
    },
    showCheckout: state => {
      state.isCheckoutVisible = true;
    },
    hideCheckout: state => {
      state.isCheckoutVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Add to cart async
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // We'll fetch the entire cart again to keep it in sync
        // For now, we'll just add the item to the state directly
        const { product, quantity } = action.payload;
        const existingItem = state.items.find(
          item => item.product.id === product.id,
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({ product, quantity });
        }
      })
      // Remove from cart async
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      })
      // Update quantity async
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find(item => item.product.id === productId);
        
        if (item) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            state.items = state.items.filter(item => item.product.id !== productId);
          } else {
            item.quantity = quantity;
          }
        }
      })
      // Clear cart async
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      })
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  showCheckout,
  hideCheckout,
} = cartSlice.actions;

export default cartSlice.reducer;