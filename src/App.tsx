import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrandSelect } from '@/pages/BrandSelect';
import { BrandHome } from '@/pages/BrandHome';
import { Menu } from '@/pages/Menu';
import { Cart } from '@/pages/Cart';
import { Coupons } from '@/pages/Coupons';
import { Pickup } from '@/pages/Pickup';
import { useBrandStore } from '@/store/useBrandStore';

function App() {
  const currentBrandId = useBrandStore(state => state.currentBrandId);
  const setCurrentBrand = useBrandStore(state => state.setCurrentBrand);

  useEffect(() => {
    if (currentBrandId) {
      document.body.classList.remove('brand-coffee', 'brand-bites', 'brand-dessert');
      document.body.classList.add(`brand-${currentBrandId}`);
      document.getElementById('root')?.classList.remove('brand-coffee', 'brand-bites', 'brand-dessert');
      document.getElementById('root')?.classList.add(`brand-${currentBrandId}`);
    }
  }, [currentBrandId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrandSelect />} />
        <Route path="/brand/:brandId" element={<BrandHome />} />
        <Route path="/brand/:brandId/menu" element={<Menu />} />
        <Route path="/brand/:brandId/coupons" element={<Coupons />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
