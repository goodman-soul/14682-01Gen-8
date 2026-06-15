import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BrandId } from '@/types';
import { useBrandStore } from '@/store/useBrandStore';
import { useCartStore } from '@/store/useCartStore';

export function useBrandSwitch() {
  const navigate = useNavigate();
  const { currentBrandId, setCurrentBrand } = useBrandStore();
  const { items, handleBrandSwitch } = useCartStore();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingBrand, setPendingBrand] = useState<BrandId | null>(null);

  const switchBrand = (newBrandId: BrandId, navigateTo?: string) => {
    if (currentBrandId === newBrandId) {
      if (navigateTo) navigate(navigateTo);
      return;
    }

    const otherBrandItems = items.filter(item => item.brandId !== newBrandId);
    
    if (otherBrandItems.length > 0) {
      setPendingBrand(newBrandId);
      setShowDialog(true);
      return;
    }
    
    setCurrentBrand(newBrandId);
    if (navigateTo) {
      navigate(navigateTo);
    } else {
      navigate(`/brand/${newBrandId}/menu`);
    }
  };

  const confirmSwitch = (strategy: 'clear' | 'keep', navigateTo?: string) => {
    if (pendingBrand) {
      handleBrandSwitch(pendingBrand, strategy);
      setCurrentBrand(pendingBrand);
      setShowDialog(false);
      if (navigateTo) {
        navigate(navigateTo);
      } else {
        navigate(`/brand/${pendingBrand}/menu`);
      }
      setPendingBrand(null);
    }
  };

  const cancelSwitch = () => {
    setShowDialog(false);
    setPendingBrand(null);
  };

  return { 
    switchBrand, 
    confirmSwitch, 
    cancelSwitch,
    showDialog, 
    setShowDialog, 
    pendingBrand,
    otherBrandCount: items.filter(item => item.brandId !== pendingBrand).length
  };
}
