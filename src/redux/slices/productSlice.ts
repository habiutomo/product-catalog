import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState } from '../../types';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchProductsByCategory,
  searchProducts
} from '../../services/api';
import { measurePerformance } from '../../utils/performance';

// Initial state
const initialState: ProductState = {
  allProducts: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: 'all',
  loading: false,
  error: null,
  searchQuery: '',
};

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await measurePerformance(
        () => fetchProducts(),
        'Fetching all products'
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await measurePerformance(
        () => fetchCategories(),
        'Fetching categories'
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      if (category === 'all') {
        return await measurePerformance(
          () => fetchProducts(),
          'Fetching all products'
        );
      }
      return await measurePerformance(
        () => fetchProductsByCategory(category),
        `Fetching products in ${category} category`
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) {
        return await fetchProducts();
      }
      return await measurePerformance(
        () => searchProducts(query),
        `Searching products with query: ${query}`
      );
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Create slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getProducts
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.allProducts = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle getCategories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle getProductsByCategory
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle searchProductsThunk
      .addCase(searchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, setSearchQuery, clearSearchQuery } = productSlice.actions;
export default productSlice.reducer;