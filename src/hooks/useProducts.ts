import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  getProducts,
  getCategories,
  getProductsByCategory,
  searchProductsThunk,
  setSelectedCategory,
  setSearchQuery,
  clearSearchQuery,
} from '../redux/slices/productSlice';
import { useCallback, useEffect } from 'react';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const {
    allProducts,
    filteredProducts,
    categories,
    selectedCategory,
    loading,
    error,
    searchQuery,
  } = useAppSelector((state) => state.products);

  // Initial load of products and categories
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(getProducts());
    }
    
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, allProducts.length, categories.length]);

  // Function to change category
  const changeCategory = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      dispatch(getProductsByCategory(category));
    },
    [dispatch],
  );

  // Function to search products
  const searchProducts = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
      dispatch(searchProductsThunk(query));
    },
    [dispatch],
  );

  // Function to clear search
  const clearSearch = useCallback(() => {
    dispatch(clearSearchQuery());
    dispatch(getProductsByCategory(selectedCategory));
  }, [dispatch, selectedCategory]);

  return {
    products: filteredProducts,
    allProducts,
    categories,
    selectedCategory,
    loading,
    error,
    searchQuery,
    changeCategory,
    searchProducts,
    clearSearch,
  };
};