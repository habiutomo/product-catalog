import { CartItem } from '../types';

type PerformanceCallback<T> = () => Promise<T>;

/**
 * Measures the performance of asynchronous operations.
 * @param callback - The async function to measure
 * @param label - Optional label for logging
 * @returns The result of the callback
 */
export const measurePerformance = async <T>(
  callback: PerformanceCallback<T>,
  label = 'Operation',
): Promise<T> => {
  console.time(label);
  try {
    const result = await callback();
    return result;
  } finally {
    console.timeEnd(label);
  }
};

/**
 * Calculates the total amount for items in the cart.
 * @param items - Array of cart items
 * @returns The total amount
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const discountedPrice =
      item.product.price * (1 - item.product.discountPercentage / 100);
    return total + discountedPrice * item.quantity;
  }, 0);
};

/**
 * Formats a price with currency symbol.
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Debounces a function to improve performance.
 * @param func - The function to debounce
 * @param wait - The wait time in milliseconds
 * @returns The debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};