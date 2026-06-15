import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ticket, ArrowLeft, Gift } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { CouponCard } from '@/components/coupon/CouponCard';
import { useCouponStore } from '@/store/useCouponStore';
import { useCartStore } from '@/store/useCartStore';
import { useCurrentBrand } from '@/store/useBrandStore';

type TabType = 'available' | 'used' | 'all';

export function Coupons() {
  const navigate = useNavigate();
  const { brandId } = useParams<{ brandId: string }>();
  const brand = useCurrentBrand();
  const { coupons, selectedCouponId, selectCoupon, getAvailableCoupons } = useCouponStore();
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const getTotalAmount = useCartStore(state => state.getTotalAmount);
  
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const total = getTotalAmount();

  const filteredCoupons = useMemo(() => {
    if (activeTab === 'available') {
      return getAvailableCoupons(brandId, undefined);
    } else if (activeTab === 'used') {
      return coupons.filter(c => c.isUsed);
    }
    return coupons;
  }, [activeTab, coupons, getAvailableCoupons, brandId]);

  const handleSelect = (couponId: string) => {
    if (selectedCouponId === couponId) {
      selectCoupon(null);
      applyCoupon(null);
    }
    navigate(-1);
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'available', label: '可使用', count: getAvailableCoupons(brandId, undefined).length },
    { key: 'used', label: '已使用', count: coupons.filter(c => c.isUsed).length },
    { key: 'all', label: '全部', count: coupons.length },
  ];

  return (
    <div className="min-h-screen bg-brand-background pb-20">
      <div 
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-semibold text-lg">我的优惠券</h1>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="flex border-b border-gray-100 bg-white">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key 
                  ? 'text-brand-primary' 
                  : 'text-gray-500'
              }`}
              style={{ color: activeTab === tab.key ? 'var(--brand-primary)' : undefined }}
            >
              {tab.label}
              <span className="text-xs ml-1 opacity-70">({tab.count})</span>
              {activeTab === tab.key && (
                <span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-4 space-y-4">
          {activeTab === 'available' && total > 0 && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4">
              <p className="text-sm text-blue-700">
                购物车金额 ¥{total.toFixed(2)}，{getAvailableCoupons(brandId, total).length} 张可用
              </p>
            </div>
          )}
          
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(coupon => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                isSelected={selectedCouponId === coupon.id}
                onSelect={() => handleSelect(coupon.id)}
                showSelectButton={!coupon.isUsed && total >= coupon.minSpend}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Gift size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500">
                {activeTab === 'available' ? '暂无可用优惠券' : 
                 activeTab === 'used' ? '暂无已使用优惠券' : '暂无优惠券'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}


