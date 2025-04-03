export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductState {
  allProducts: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export interface CartState {
  items: CartItem[];
  isCheckoutVisible: boolean;
}

export interface FavoriteState {
  items: number[]; // Array of product IDs
}

export interface RootState {
  products: ProductState;
  cart: CartState;
  favorites: FavoriteState;
}