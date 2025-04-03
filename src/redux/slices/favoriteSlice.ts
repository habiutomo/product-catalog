import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FavoriteState } from '../../types';
import * as Database from '../../services/database';

const initialState: FavoriteState = {
  items: [],
};

// Async thunks for database operations
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchItems',
  async () => {
    try {
      const favoriteIds = await Database.getFavorites();
      return favoriteIds;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [] as number[];
    }
  }
);

export const addToFavoritesAsync = createAsyncThunk(
  'favorites/addToFavoritesAsync',
  async (productId: number) => {
    try {
      await Database.addToFavorites(productId);
      return productId;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }
);

export const removeFromFavoritesAsync = createAsyncThunk(
  'favorites/removeFromFavoritesAsync',
  async (productId: number) => {
    try {
      await Database.removeFromFavorites(productId);
      return productId;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavoriteAsync',
  async (productId: number, { getState }) => {
    const state = getState() as { favorites: FavoriteState };
    const isFavorite = state.favorites.items.includes(productId);
    
    try {
      if (isFavorite) {
        await Database.removeFromFavorites(productId);
      } else {
        await Database.addToFavorites(productId);
      }
      return { productId, isFavorite };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Keep sync reducers for UI operations
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      
      if (index !== -1) {
        // Remove from favorites if already exists
        state.items.splice(index, 1);
      } else {
        // Add to favorites
        state.items.push(productId);
      }
    },
    addToFavorites: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (!state.items.includes(productId)) {
        state.items.push(productId);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(id => id !== action.payload);
    },
    clearFavorites: state => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Add to favorites async
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      // Remove from favorites async
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
      })
      // Toggle favorite async
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload;
        
        if (isFavorite) {
          // Was favorite, now remove it
          state.items = state.items.filter(id => id !== productId);
        } else {
          // Wasn't favorite, now add it
          if (!state.items.includes(productId)) {
            state.items.push(productId);
          }
        }
      });
  },
});

export const {
  toggleFavorite,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;