import { useNavigate } from 'react-router-dom';
import { Ticket, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/utils/price';
import { useCartStore } from '@/store/useCartStore';
import { useCouponStore } from '@/store/useCouponStore';
import { useServiceType } from '@/hooks/useServiceType';
import { useCurrentBrand } from '@/store/useBrandStore';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const navigate = useNavigate();
  const brand = useCurrentBrand();
  const { serviceType, setServiceType } = useServiceType();
  const getTotalAmount = useCartStore(state => state.getTotalAmount);
  const getDiscountedAmount = useCartStore(state => state.getDiscountedAmount);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const appliedCouponId = useCartStore(state => state.appliedCouponId);
  const couponType = useCartStore(state => state.couponType);
  const couponValue = useCartStore(state => state.couponValue);
  const { coupons } = useCouponStore();
  
  const totalAmount = getTotalAmount();
  const discountedAmount = getDiscountedAmount();
  const totalItems = getTotalItems();
  const discountAmount = totalAmount - discountedAmount;
  
  const appliedCoupon = coupons.find(c => c.id === appliedCouponId);

  const deliveryFee = brand?.serviceRules.takeoutDeliveryFee && serviceType === 'takeout' 
    ? brand.serviceRules.takeoutDeliveryFee 
    : 0;

  const finalAmount = discountedAmount + deliveryFee;

  const canCheckout = totalItems > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
      {brand && (
        <div className="flex justify-around py-2 border-b border-gray-50">
          <button
            onClick={() => setServiceType('dineIn')}
            disabled={!brand.serviceRules.allowDineIn}
            className={`flex-1 py-2 mx-2 rounded-lg text-sm font-medium transition-all ${
              serviceType === 'dineIn'
                ? 'text-white shadow-md'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              backgroundColor: serviceType === 'dineIn' ? 'var(--brand-primary)' : undefined,
            }}
          >
            🍽️ 堂食
            {brand.serviceRules.dineInMinOrder > 0 && (
              <span className="block text-xs opacity-80">
                最低 ¥{brand.serviceRules.dineInMinOrder}
              </span>
            )}
          </button>
          <button
            onClick={() => setServiceType('takeout')}
            disabled={!brand.serviceRules.allowTakeout}
            className={`flex-1 py-2 mx-2 rounded-lg text-sm font-medium transition-all ${
              serviceType === 'takeout'
                ? 'text-white shadow-md'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              backgroundColor: serviceType === 'takeout' ? 'var(--brand-primary)' : undefined,
            }}
          >
            🛍️ 外带
            {deliveryFee > 0 && (
              <span className="block text-xs opacity-80">
                配送费 ¥{deliveryFee}
              </span>
            )}
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/coupons')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Ticket size={18} style={{ color: 'var(--brand-secondary)' }} />
            {appliedCoupon ? (
              <span className="text-sm font-medium" style={{ color: 'var(--brand-secondary)' }}>
                {appliedCoupon.name}
              </span>
            ) : (
              <span className="text-sm text-gray-500">选择优惠券</span>
            )}
            <ChevronRight size={14} className="text-gray-400" />
          </button>
          
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">合计</span>
              <span className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(finalAmount)}
              </span>
            </div>
            {discountAmount > 0 && (
              <p className="text-xs text-green-600">
                已优惠 {formatPrice(discountAmount)}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={!canCheckout}
          className="px-6 py-2.5 rounded-full text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          去结算 · {totalItems}件
        </button>
      </div>
    </div>
  );
}
