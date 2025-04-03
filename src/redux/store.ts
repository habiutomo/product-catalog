import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoriteSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;