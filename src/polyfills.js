/**
 * Polyfill for setImmediate in web environment
 */
if (typeof window !== 'undefined') {
  window.setImmediate = (callback) => setTimeout(callback, 0);
}