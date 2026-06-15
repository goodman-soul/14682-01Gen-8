import { create } from 'zustand';
import type { CartItem, CartState, BrandId } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import { calculateFinalPrice } from '@/utils/price';

interface CartStore extends CartState {
  items: CartItem[];
  appliedCouponId: string | null;
  couponType: 'percent' | 'fixed' | null;
  couponValue: number | null;
  
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearBrandItems: (brandId: BrandId) => void;
  clearAll: () => void;
  applyCoupon: (couponId: string | null, type?: 'percent' | 'fixed', value?: number) => void;
  handleBrandSwitch: (newBrandId: BrandId, strategy: 'clear' | 'keep') => void;
  
  getBrandItems: (brandId: BrandId) => CartItem[];
  getBrandTotal: (brandId: BrandId) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getDiscountedAmount: () => number;
  getUniqueBrands: () => BrandId[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, []),
  appliedCouponId: null,
  couponType: null,
  couponValue: null,

  getBrandItems: (brandId: BrandId) => {
    return get().items.filter(item => item.brandId === brandId);
  },

  getBrandTotal: (brandId: BrandId) => {
    return get().getBrandItems(brandId).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getDiscountedAmount: () => {
    const total = get().getTotalAmount();
    const { couponType, couponValue } = get();
    if (!couponType || couponValue === null) return total;
    return calculateFinalPrice(total, couponType, couponValue);
  },

  getUniqueBrands: () => {
    return [...new Set(get().items.map(item => item.brandId))];
  },

  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find(
      i => i.productId === item.productId && 
           JSON.stringify(i.selectedSpecs) === JSON.stringify(item.selectedSpecs)
    );
    
    let newItems;
    if (existingItem) {
      newItems = items.map(i => 
        i.id === existingItem.id 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newItems = [...items, { ...item, id: generateId() }];
    }
    
    set({ items: newItems });
    saveToStorage(STORAGE_KEYS.CART, newItems);
  },

  updateQuantity: (itemId, quantity) => {
    const newItems = get().items
      .map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      .filter(item => item.quantity > 0);
    
    set({ items: newItems });
    saveToStorage(STORAGE_KEYS.CART, newItems);
  },

  removeItem: (itemId) => {
    const newItems = get().items.filter(item => item.id !== itemId);
    set({ items: newItems });
    saveToStorage(STORAGE_KEYS.CART, newItems);
  },

  clearBrandItems: (brandId) => {
    const newItems = get().items.filter(item => item.brandId !== brandId);
    set({ items: newItems });
    saveToStorage(STORAGE_KEYS.CART, newItems);
  },

  clearAll: () => {
    set({ items: [], appliedCouponId: null, couponType: null, couponValue: null });
    saveToStorage(STORAGE_KEYS.CART, []);
  },

  applyCoupon: (couponId, type, value) => {
    set({ 
      appliedCouponId: couponId, 
      couponType: type || null, 
      couponValue: value || null 
    });
  },

  handleBrandSwitch: (newBrandId, strategy) => {
    if (strategy === 'clear') {
      const newItems = get().items.filter(item => item.brandId === newBrandId);
      set({ items: newItems, appliedCouponId: null, couponType: null, couponValue: null });
      saveToStorage(STORAGE_KEYS.CART, newItems);
    }
  },
}));
