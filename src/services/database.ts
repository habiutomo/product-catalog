import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../types';

// Enable promise mode for SQLite
SQLite.enablePromise(true);

// Database name
const DATABASE = {
  name: 'shopapp.db',
  version: '1.0',
  displayName: 'ShopApp Database',
  size: 200000,
};

// Initialize the database
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  let db: SQLite.SQLiteDatabase;
  
  // Use AsyncStorage for web platforms since SQLite isn't directly available
  if (Platform.OS === 'web') {
    console.log('Web platform detected, using AsyncStorage instead of SQLite');
    
    // Check if we have any data in AsyncStorage
    try {
      const productsJson = await AsyncStorage.getItem('products');
      if (!productsJson) {
        console.log('No products found in AsyncStorage, initializing with empty array');
        await AsyncStorage.setItem('products', JSON.stringify([]));
      }
      
      const cartJson = await AsyncStorage.getItem('cart');
      if (!cartJson) {
        console.log('No cart items found in AsyncStorage, initializing with empty array');
        await AsyncStorage.setItem('cart', JSON.stringify([]));
      }
      
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (!favoritesJson) {
        console.log('No favorites found in AsyncStorage, initializing with empty array');
        await AsyncStorage.setItem('favorites', JSON.stringify([]));
      }
      
      console.log('AsyncStorage initialized successfully');
    } catch (error) {
      console.error('Error initializing AsyncStorage:', error);
      throw error;
    }
    
    return Promise.resolve(null as unknown as SQLite.SQLiteDatabase);
  }
  
  try {
    // SQLite.openDatabase accepts different params based on platform
    db = await SQLite.openDatabase({
      name: DATABASE.name,
      location: 'default',
    });
    
    // Create tables if they don't exist
    await createTables(db);
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

// Create necessary tables
const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  // Products table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price REAL,
      discountPercentage REAL,
      rating REAL,
      stock INTEGER,
      brand TEXT,
      category TEXT,
      thumbnail TEXT,
      images TEXT
    );
  `);

  // Cart table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  // Favorites table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS favorites (
      product_id INTEGER PRIMARY KEY,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);
};

// Store products in the database
export const storeProducts = async (products: Product[]): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Error storing products in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    // For each product, check if it exists and insert if not
    for (const product of products) {
      // Check if product already exists
      const [existsResult] = await db.executeSql(
        'SELECT id FROM products WHERE id = ?',
        [product.id]
      );
      
      // If product doesn't exist, insert it
      if (existsResult.rows.length === 0) {
        await db.executeSql(
          `INSERT INTO products (
            id, title, description, price, discountPercentage,
            rating, stock, brand, category, thumbnail, images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.id,
            product.title,
            product.description,
            product.price,
            product.discountPercentage,
            product.rating,
            product.stock,
            product.brand,
            product.category,
            product.thumbnail,
            JSON.stringify(product.images)
          ]
        );
      }
    }
  } catch (error) {
    console.error('Error storing products:', error);
    throw error;
  }
};

// Get all products from the database
export const getProducts = async (): Promise<Product[]> => {
  if (Platform.OS === 'web') {
    try {
      const productsJson = await AsyncStorage.getItem('products');
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error('Error getting products from AsyncStorage:', error);
      throw error;
    }
  }

  const db = await initDatabase();
  
  try {
    const [result] = await db.executeSql('SELECT * FROM products');
    
    const products: Product[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      products.push({
        ...row,
        images: JSON.parse(row.images)
      });
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  if (Platform.OS === 'web') {
    try {
      const productsJson = await AsyncStorage.getItem('products');
      const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
      return products.filter(product => product.category === category);
    } catch (error) {
      console.error('Error getting products by category from AsyncStorage:', error);
      throw error;
    }
  }

  const db = await initDatabase();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM products WHERE category = ?',
      [category]
    );
    
    const products: Product[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      products.push({
        ...row,
        images: JSON.parse(row.images)
      });
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  if (Platform.OS === 'web') {
    try {
      const productsJson = await AsyncStorage.getItem('products');
      const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error('Error getting product by ID from AsyncStorage:', error);
      throw error;
    }
  }

  const db = await initDatabase();
  
  try {
    const [result] = await db.executeSql(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows.item(0);
    return {
      ...row,
      images: JSON.parse(row.images)
    };
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (product: Product, quantity: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const cartJson = await AsyncStorage.getItem('cart');
      const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
      
      const existingItem = cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ product, quantity });
      }
      
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    // First, ensure the product exists in the products table
    await storeProducts([product]);
    
    // Check if the product is already in the cart
    const [existsResult] = await db.executeSql(
      'SELECT id, quantity FROM cart WHERE product_id = ?',
      [product.id]
    );
    
    if (existsResult.rows.length > 0) {
      // Update quantity if the product is already in the cart
      const cartItem = existsResult.rows.item(0);
      const newQuantity = cartItem.quantity + quantity;
      
      await db.executeSql(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, cartItem.id]
      );
    } else {
      // Insert new item if the product is not in the cart
      await db.executeSql(
        'INSERT INTO cart (product_id, quantity) VALUES (?, ?)',
        [product.id, quantity]
      );
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Get cart items
export const getCartItems = async (): Promise<CartItem[]> => {
  if (Platform.OS === 'web') {
    try {
      const cartJson = await AsyncStorage.getItem('cart');
      return cartJson ? JSON.parse(cartJson) : [];
    } catch (error) {
      console.error('Error getting cart from AsyncStorage:', error);
      throw error;
    }
  }

  const db = await initDatabase();
  
  try {
    const [result] = await db.executeSql(`
      SELECT c.id, c.product_id, c.quantity, p.*
      FROM cart c
      JOIN products p ON c.product_id = p.id
    `);
    
    const cartItems: CartItem[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      cartItems.push({
        product: {
          id: row.product_id,
          title: row.title,
          description: row.description,
          price: row.price,
          discountPercentage: row.discountPercentage,
          rating: row.rating,
          stock: row.stock,
          brand: row.brand,
          category: row.category,
          thumbnail: row.thumbnail,
          images: JSON.parse(row.images)
        },
        quantity: row.quantity
      });
    }
    
    return cartItems;
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (productId: number, quantity: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const cartJson = await AsyncStorage.getItem('cart');
      const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
      
      const updatedCart = cart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating cart item in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    await db.executeSql(
      'UPDATE cart SET quantity = ? WHERE product_id = ?',
      [quantity, productId]
    );
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const cartJson = await AsyncStorage.getItem('cart');
      const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
      
      const updatedCart = cart.filter(item => item.product.id !== productId);
      
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing from cart in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    await db.executeSql(
      'DELETE FROM cart WHERE product_id = ?',
      [productId]
    );
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing cart in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    await db.executeSql('DELETE FROM cart');
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Add to favorites
export const addToFavorites = async (productId: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites: number[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    // Check if already in favorites
    const [existsResult] = await db.executeSql(
      'SELECT product_id FROM favorites WHERE product_id = ?',
      [productId]
    );
    
    if (existsResult.rows.length === 0) {
      await db.executeSql(
        'INSERT INTO favorites (product_id) VALUES (?)',
        [productId]
      );
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove from favorites
export const removeFromFavorites = async (productId: number): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites: number[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      const updatedFavorites = favorites.filter(id => id !== productId);
      
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites in AsyncStorage:', error);
      throw error;
    }
    return;
  }

  const db = await initDatabase();
  
  try {
    await db.executeSql(
      'DELETE FROM favorites WHERE product_id = ?',
      [productId]
    );
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get all favorite product IDs
export const getFavorites = async (): Promise<number[]> => {
  if (Platform.OS === 'web') {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites from AsyncStorage:', error);
      throw error;
    }
  }

  const db = await initDatabase();
  
  try {
    const [result] = await db.executeSql('SELECT product_id FROM favorites');
    
    const favoriteIds: number[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      favoriteIds.push(result.rows.item(i).product_id);
    }
    
    return favoriteIds;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};