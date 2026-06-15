import { Home, Utensils, ShoppingCart, Ticket, QrCode } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';

const navItems = [
  { path: '/brand/:brandId', icon: Home, label: '首页' },
  { path: '/brand/:brandId/menu', icon: Utensils, label: '菜单' },
  { path: '/cart', icon: ShoppingCart, label: '购物车' },
  { path: '/coupons', icon: Ticket, label: '优惠券' },
  { path: '/pickup', icon: QrCode, label: '取餐' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ brandId: string }>();
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const brandId = params.brandId || 'coffee';
  
  const totalItems = getTotalItems();

  const isActive = (path: string) => {
    const resolvedPath = path.replace(':brandId', brandId);
    return location.pathname === resolvedPath || 
           (path === '/brand/:brandId' && location.pathname === `/brand/${brandId}`);
  };

  const handleNavigate = (path: string) => {
    const resolvedPath = path.replace(':brandId', brandId);
    navigate(resolvedPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[60px] transition-all ${
                active ? 'scale-105' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ 
                color: active ? 'var(--brand-primary)' : undefined 
              }}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {item.label === '购物车' && totalItems > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-secondary)' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <span 
                  className="absolute -bottom-1 w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
