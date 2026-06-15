import { ChevronLeft, ShoppingCart, Search, Menu } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentBrand } from '@/store/useBrandStore';
import { useCartStore } from '@/store/useCartStore';
import { useBrandSwitch } from '@/hooks/useBrandSwitch';

interface HeaderProps {
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  showBrandSwitch?: boolean;
  title?: string;
}

export function Header({ 
  showBack = true, 
  showCart = true, 
  showSearch = true,
  showBrandSwitch = true,
  title 
}: HeaderProps) {
  const navigate = useNavigate();
  const params = useParams();
  const brand = useCurrentBrand();
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const { switchBrand, showDialog, confirmSwitch, cancelSwitch, pendingBrand, otherBrandCount } = useBrandSwitch();
  
  const totalItems = getTotalItems();

  const style = {
    backgroundColor: 'var(--brand-primary)',
    color: 'var(--brand-surface)',
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-md animate-fade-in"
        style={style}
      >
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            {brand && (
              <button
                onClick={() => showBrandSwitch && navigate('/')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl">{brand.logoUrl}</span>
                <div className="text-left">
                  <h1 className="font-display font-semibold text-lg leading-tight">
                    {title || brand.name}
                  </h1>
                  {!title && (
                    <p className="text-xs opacity-80">{brand.slogan}</p>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showSearch && (
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Search size={20} />
            </button>
          )}
          
          {showCart && (
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-secondary)' }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {showDialog && pendingBrand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-display text-xl font-semibold mb-2 text-brand-text">
              切换品牌
            </h3>
            <p className="text-brand-text-secondary mb-6">
              您的购物车中有 <span className="font-semibold text-brand-primary">{otherBrandCount}件</span> 其他品牌商品，切换后如何处理？
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => confirmSwitch('clear')}
                className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                清空其他品牌商品
              </button>
              <button
                onClick={() => confirmSwitch('keep')}
                className="w-full py-3 px-4 rounded-xl font-medium border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
              >
                保留全部商品
              </button>
              <button
                onClick={cancelSwitch}
                className="w-full py-3 px-4 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
