import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ticket, ArrowLeft, Gift } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { CouponCard } from '@/components/coupon/CouponCard';
import { useCouponStore } from '@/store/useCouponStore';
import { useCartStore } from '@/store/useCartStore';
import { useBrandStore } from '@/store/useBrandStore';
import { brands } from '@/data/brands';
import type { BrandId, Coupon } from '@/types';

type TabType = 'available' | 'used' | 'all';

export function Coupons() {
  const navigate = useNavigate();
  const { brandId: routeBrandId } = useParams<{ brandId: string }>();
  const storeBrandId = useBrandStore(state => state.currentBrandId);
  const setCurrentBrand = useBrandStore(state => state.setCurrentBrand);
  const { coupons, selectedCouponId, selectCoupon } = useCouponStore();
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const getApplicableBrandsTotal = useCartStore(state => state.getApplicableBrandsTotal);
  const getTotalAmount = useCartStore(state => state.getTotalAmount);

  const effectiveBrandId = (routeBrandId || storeBrandId) as BrandId | undefined;
  const brand = effectiveBrandId ? brands.find(b => b.id === effectiveBrandId) : undefined;

  useEffect(() => {
    if (routeBrandId && brands.find(b => b.id === routeBrandId) && routeBrandId !== storeBrandId) {
      setCurrentBrand(routeBrandId as BrandId);
    }
  }, [routeBrandId, storeBrandId, setCurrentBrand]);

  const [activeTab, setActiveTab] = useState<TabType>('available');
  const cartTotal = getTotalAmount();

  const isCouponUsable = (coupon: Coupon): boolean => {
    if (coupon.isUsed) return false;
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
    if (now < validFrom || now > validTo) return false;
    const applicableTotal = getApplicableBrandsTotal(coupon.applicableBrandIds);
    return applicableTotal >= coupon.minSpend;
  };

  const filteredCoupons = useMemo(() => {
    if (activeTab === 'available') {
      return coupons.filter(c => {
        if (c.isUsed) return false;
        const now = new Date();
        const validFrom = new Date(c.validFrom);
        const validTo = new Date(c.validTo);
        if (now < validFrom || now > validTo) return false;
        if (effectiveBrandId && c.applicableBrandIds !== 'all' && !c.applicableBrandIds.includes(effectiveBrandId)) {
          return false;
        }
        return true;
      });
    } else if (activeTab === 'used') {
      return coupons.filter(c => c.isUsed);
    }
    return coupons;
  }, [activeTab, coupons, effectiveBrandId]);

  const availableCount = coupons.filter(c => !c.isUsed && (
    effectiveBrandId
      ? (c.applicableBrandIds === 'all' || c.applicableBrandIds.includes(effectiveBrandId))
      : true
  ) && isCouponUsable(c)).length;

  const handleSelect = (coupon: Coupon) => {
    if (!isCouponUsable(coupon)) return;
    if (selectedCouponId === coupon.id) {
      selectCoupon(null);
      applyCoupon(null);
    } else {
      selectCoupon(coupon.id);
      applyCoupon(coupon.id, coupon.type, coupon.value);
    }
    navigate(-1);
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'available', label: '可使用', count: availableCount },
    { key: 'used', label: '已使用', count: coupons.filter(c => c.isUsed).length },
    { key: 'all', label: '全部', count: coupons.length },
  ];

  const headerBg = brand?.theme.primary || 'var(--brand-primary)';

  return (
    <div className="min-h-screen bg-brand-background pb-20">
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: headerBg, color: 'white' }}
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
              style={{ color: activeTab === tab.key ? headerBg : undefined }}
            >
              {tab.label}
              <span className="text-xs ml-1 opacity-70">({tab.count})</span>
              {activeTab === tab.key && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: headerBg }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {activeTab === 'available' && cartTotal > 0 && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4">
              <p className="text-sm text-blue-700">
                购物车合计 ¥{cartTotal.toFixed(2)}，当前品牌可用 {availableCount} 张券
              </p>
              <p className="text-xs text-blue-600 mt-1 opacity-80">
                * 优惠券门槛按其适用品牌的购物车小计计算
              </p>
            </div>
          )}

          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(coupon => {
              const applicableTotal = getApplicableBrandsTotal(coupon.applicableBrandIds);
              const reachable = applicableTotal >= coupon.minSpend;
              const brandNames = coupon.applicableBrandIds === 'all'
                ? '全品牌通用'
                : coupon.applicableBrandIds.map(id => brands.find(b => b.id === id)?.name).filter(Boolean).join('、');
              return (
                <div key={coupon.id}>
                  <CouponCard
                    coupon={coupon}
                    isSelected={selectedCouponId === coupon.id}
                    onSelect={() => handleSelect(coupon)}
                    showSelectButton={!coupon.isUsed && reachable}
                  />
                  {!coupon.isUsed && coupon.minSpend > 0 && (
                    <p className={`text-xs mt-1 mb-3 ml-1 ${reachable ? 'text-green-600' : 'text-gray-400'}`}>
                      {coupon.applicableBrandIds !== 'all' && `适用：${brandNames} · `}
                      {reachable
                        ? `已满足门槛（¥${applicableTotal.toFixed(2)} ≥ ¥${coupon.minSpend}）`
                        : `还差 ¥${(coupon.minSpend - applicableTotal).toFixed(2)} 可用（${brandNames}小计 ¥${applicableTotal.toFixed(2)}）`}
                    </p>
                  )}
                </div>
              );
            })
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
