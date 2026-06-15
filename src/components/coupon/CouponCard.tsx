import { Check, Ticket } from 'lucide-react';
import type { Coupon } from '@/types';
import { brands } from '@/data/brands';
import { formatPrice } from '@/utils/price';
import { useCouponStore } from '@/store/useCouponStore';
import { useCartStore } from '@/store/useCartStore';

interface CouponCardProps {
  coupon: Coupon;
  isSelected?: boolean;
  onSelect?: () => void;
  showSelectButton?: boolean;
}

export function CouponCard({ coupon, isSelected, onSelect, showSelectButton = true }: CouponCardProps) {
  const selectCoupon = useCouponStore(state => state.selectCoupon);
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const getTotalAmount = useCartStore(state => state.getTotalAmount);
  
  const total = getTotalAmount();
  const canUse = total >= coupon.minSpend;
  
  const applicableBrands = coupon.applicableBrandIds === 'all' 
    ? brands 
    : brands.filter(b => coupon.applicableBrandIds.includes(b.id));

  const handleSelect = () => {
    if (coupon.isUsed || !canUse) return;
    
    if (isSelected) {
      selectCoupon(null);
      applyCoupon(null);
    } else {
      selectCoupon(coupon.id);
      applyCoupon(coupon.id, coupon.type, coupon.value);
      if (onSelect) onSelect();
    }
  };

  const discountDisplay = coupon.type === 'percent' 
    ? `${coupon.value}% OFF`
    : formatPrice(coupon.value);

  return (
    <div 
      className={`relative bg-white rounded-xl overflow-hidden shadow-sm transition-all ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      } ${coupon.isUsed || !canUse ? 'opacity-60' : 'hover:shadow-md cursor-pointer'}`}
      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
      onClick={handleSelect}
    >
      <div className="flex">
        <div 
          className="w-28 flex flex-col items-center justify-center text-white p-3 relative"
          style={{ backgroundColor: coupon.isUsed ? '#9CA3AF' : 'var(--brand-primary)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-background" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-brand-background" />
          
          <Ticket size={24} className="mb-1 opacity-80" />
          <span className="text-2xl font-bold leading-none">{discountDisplay}</span>
          {coupon.minSpend > 0 && (
            <span className="text-xs opacity-80 mt-1">满{coupon.minSpend}可用</span>
          )}
        </div>
        
        <div className="flex-1 p-3 relative">
          <div className="absolute top-0 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-background" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 w-2 h-2 rounded-full bg-brand-background" />
          
          <h4 className="font-semibold text-brand-text text-sm mb-1">
            {coupon.name}
          </h4>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {applicableBrands.map(brand => (
              <span 
                key={brand.id}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs"
                style={{ 
                  backgroundColor: `${brand.theme.primary}15`,
                  color: brand.theme.primary,
                }}
              >
                {brand.logoUrl} {brand.name}
              </span>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mb-2">
            有效期至 {coupon.validTo}
          </p>
          
          <div className="flex items-center justify-between">
            {coupon.isUsed ? (
              <span className="text-xs text-gray-500 font-medium">已使用</span>
            ) : !canUse ? (
              <span className="text-xs text-orange-500 font-medium">
                还差 {formatPrice(coupon.minSpend - total)} 可用
              </span>
            ) : showSelectButton ? (
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected 
                    ? 'text-white' 
                    : 'border hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--brand-primary)' : undefined,
                  borderColor: isSelected ? undefined : 'var(--brand-primary)',
                  color: isSelected ? undefined : 'var(--brand-primary)',
                }}
              >
                {isSelected ? (
                  <span className="flex items-center gap-1">
                    <Check size={12} /> 已选择
                  </span>
                ) : (
                  '立即使用'
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      
      <div 
        className="absolute left-28 top-0 bottom-0 border-l-2 border-dashed border-gray-100"
        style={{
          backgroundImage: 'radial-gradient(circle, transparent 1px, white 1px)',
          backgroundSize: '4px 4px',
          backgroundPosition: 'left center',
          backgroundRepeat: 'repeat-y',
        }}
      />
    </div>
  );
}
