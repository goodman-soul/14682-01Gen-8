import { create } from 'zustand';
import type { Brand, BrandId, Theme } from '@/types';
import { brands } from '@/data/brands';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

interface BrandStore {
  currentBrandId: BrandId | null;
  brands: Brand[];
  setCurrentBrand: (brandId: BrandId) => void;
  getCurrentBrand: () => Brand | undefined;
  getTheme: () => Theme | null;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  currentBrandId: loadFromStorage<BrandId | null>(STORAGE_KEYS.CURRENT_BRAND, null),
  brands,
  
  setCurrentBrand: (brandId: BrandId) => {
    set({ currentBrandId: brandId });
    saveToStorage(STORAGE_KEYS.CURRENT_BRAND, brandId);
    
    document.body.classList.remove('brand-coffee', 'brand-bites', 'brand-dessert');
    document.body.classList.add(`brand-${brandId}`);
    document.getElementById('root')?.classList.remove('brand-coffee', 'brand-bites', 'brand-dessert');
    document.getElementById('root')?.classList.add(`brand-${brandId}`);
  },
  
  getCurrentBrand: () => {
    const { currentBrandId, brands } = get();
    return brands.find(b => b.id === currentBrandId);
  },
  
  getTheme: () => {
    const brand = get().getCurrentBrand();
    return brand ? brand.theme : null;
  },
}));

export const useCurrentBrand = () => {
  const { currentBrandId, brands } = useBrandStore();
  return brands.find(b => b.id === currentBrandId);
};
