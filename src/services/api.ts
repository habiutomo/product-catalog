import { Product, ProductsResponse } from '../types';
import * as Database from './database';
import { measurePerformance } from '../utils/performance';

const API_BASE_URL = 'https://dummyjson.com';

/**
 * Fetches products from the API and stores them in the local database
 */
export const fetchProducts = async (): Promise<Product[]> => {
  return await measurePerformance(async () => {
    try {
      // First, try to get products from the local database
      const localProducts = await Database.getProducts();
      
      // If we have products in the database, return them
      if (localProducts && localProducts.length > 0) {
        console.log('Returning products from local database');
        return localProducts;
      }
      
      // Otherwise, fetch products from the API
      console.log('Fetching products from API');
      const response = await fetch(`${API_BASE_URL}/products?limit=100`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      // Store products in the local database for future use
      await Database.storeProducts(data.products);
      
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }, 'fetchProducts');
};

/**
 * Fetches products by category from the API or local database
 */
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  return await measurePerformance(async () => {
    try {
      if (category === 'all') {
        return fetchProducts();
      }
      
      // First, try to get products from the local database
      const localProducts = await Database.getProductsByCategory(category);
      
      // If we have products in the database, return them
      if (localProducts && localProducts.length > 0) {
        console.log(`Returning ${category} products from local database`);
        return localProducts;
      }
      
      // Otherwise, fetch products from the API
      console.log(`Fetching ${category} products from API`);
      const response = await fetch(
        `${API_BASE_URL}/products/category/${category}?limit=100`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      // Store products in the local database for future use
      await Database.storeProducts(data.products);
      
      return data.products;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }, `fetchProductsByCategory:${category}`);
};

/**
 * Fetches a product by ID from the API or local database
 */
export const fetchProductById = async (id: number): Promise<Product> => {
  return await measurePerformance(async () => {
    try {
      // First, try to get the product from the local database
      const localProduct = await Database.getProductById(id);
      
      // If we have the product in the database, return it
      if (localProduct) {
        console.log(`Returning product ${id} from local database`);
        return localProduct;
      }
      
      // Otherwise, fetch the product from the API
      console.log(`Fetching product ${id} from API`);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const product: Product = await response.json();
      
      // Store the product in the local database for future use
      await Database.storeProducts([product]);
      
      return product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }, `fetchProductById:${id}`);
};

/**
 * Fetches categories from the API
 */
export const fetchCategories = async (): Promise<string[]> => {
  return await measurePerformance(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const categories: string[] = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }, 'fetchCategories');
};

/**
 * Searches products by query string
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  return await measurePerformance(async () => {
    try {
      // For search, we'll always hit the API for fresh results
      const response = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      // Store these products in the database too
      if (data.products.length > 0) {
        await Database.storeProducts(data.products);
      }
      
      return data.products;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  }, `searchProducts:${query}`);
};