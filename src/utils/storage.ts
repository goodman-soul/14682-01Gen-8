const STORAGE_KEYS = {
  CART: 'multi_brand_cart',
  CURRENT_BRAND: 'multi_brand_current_brand',
  ORDERS: 'multi_brand_orders',
  SELECTED_COUPON: 'multi_brand_selected_coupon',
  SERVICE_TYPE: 'multi_brand_service_type',
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
  }
};

export { STORAGE_KEYS };
