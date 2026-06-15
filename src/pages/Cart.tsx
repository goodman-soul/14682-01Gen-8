import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BrandGroup } from '@/components/cart/BrandGroup';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useCouponStore } from '@/store/useCouponStore';
import { useServiceType } from '@/hooks/useServiceType';
import { brands } from '@/data/brands';
import type { OrderItem } from '@/types';

export function Cart() {
  const navigate = useNavigate();
  const { items, getUniqueBrands, getBrandItems, clearAll, getTotalAmount, getDiscountedAmount, appliedCouponId } = useCartStore();
  const { createOrder } = useOrderStore();
  const { markCouponAsUsed } = useCouponStore();
  const { serviceType } = useServiceType();
  
  const uniqueBrands = getUniqueBrands();
  const outOfStockItems = items.filter(i => i.isOutOfStock);

  const handleCheckout = () => {
    const inStockItems = items.filter(i => !i.isOutOfStock);
    
    if (inStockItems.length === 0) {
      alert('购物车中没有可结算的商品');
      return;
    }

    uniqueBrands.forEach(brandId => {
      const brandItems = inStockItems.filter(i => i.brandId === brandId);
      if (brandItems.length === 0) return;

      const orderItems: OrderItem[] = brandItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        spec: Object.entries(item.selectedSpecs)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · '),
      }));

      const totalAmount = brandItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const discountAmount = totalAmount - getDiscountedAmount() * (totalAmount / getTotalAmount());

      const order = createOrder(
        brandId,
        orderItems,
        totalAmount,
        discountAmount,
        serviceType
      );

      if (appliedCouponId) {
        markCouponAsUsed(appliedCouponId);
      }

      navigate('/pickup', { state: { orderId: order.id } });
    });

    clearAll();
  };

  return (
    <div className="min-h-screen bg-brand-background pb-48">
      <Header title="购物车" showSearch={false} />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {uniqueBrands.length > 1 && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  购物车包含 {uniqueBrands.length} 个品牌商品
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  将按品牌分别生成订单和取餐码
                </p>
              </div>
            </div>
          </div>
        )}
        
        {outOfStockItems.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {outOfStockItems.length} 件商品已售罄
                </p>
                <p className="text-xs text-red-600 mt-1">
                  结算时将自动移除这些商品
                </p>
              </div>
            </div>
          </div>
        )}
        
        {items.length > 0 ? (
          <>
            {uniqueBrands.map(brandId => (
              <BrandGroup
                key={brandId}
                brandId={brandId}
                items={getBrandItems(brandId)}
              />
            ))}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
                清空购物车
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4">购物车是空的</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-medium"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              去逛逛
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      <CartSummary onCheckout={handleCheckout} />
      <BottomNav />
    </div>
  );
}
