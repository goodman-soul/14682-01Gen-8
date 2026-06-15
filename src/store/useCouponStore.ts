import { create } from 'zustand';
import type { Coupon, BrandId } from '@/types';
import { coupons, getAvailableCoupons } from '@/data/coupons';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

interface CouponStore {
  coupons: Coupon[];
  selectedCouponId: string | null;
  
  getAvailableCoupons: (brandId?: BrandId, total?: number) => Coupon[];
  selectCoupon: (couponId: string | null) => void;
  markCouponAsUsed: (couponId: string) => void;
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  coupons,
  selectedCouponId: loadFromStorage<string | null>(STORAGE_KEYS.SELECTED_COUPON, null),

  getAvailableCoupons: (brandId, total) => {
    return getAvailableCoupons(brandId, total);
  },

  selectCoupon: (couponId) => {
    set({ selectedCouponId: couponId });
    saveToStorage(STORAGE_KEYS.SELECTED_COUPON, couponId);
  },

  markCouponAsUsed: (couponId) => {
    set(state => ({
      coupons: state.coupons.map(c => 
        c.id === couponId ? { ...c, isUsed: true } : c
      ),
      selectedCouponId: state.selectedCouponId === couponId ? null : state.selectedCouponId,
    }));
  },
}));
