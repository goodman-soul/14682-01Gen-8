import type { Coupon } from '@/types';

export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    name: '全场通用满50减10',
    type: 'fixed',
    value: 10,
    minSpend: 50,
    applicableBrandIds: 'all',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isUsed: false,
  },
  {
    id: 'coupon-2',
    name: '咖啡专属8折券',
    type: 'percent',
    value: 20,
    minSpend: 0,
    applicableBrandIds: ['coffee'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isUsed: false,
  },
  {
    id: 'coupon-3',
    name: '简餐满80减20',
    type: 'fixed',
    value: 20,
    minSpend: 80,
    applicableBrandIds: ['bites'],
    validFrom: '2026-01-01',
    validTo: '2026-06-30',
    isUsed: false,
  },
  {
    id: 'coupon-4',
    name: '甜品第二份半价',
    type: 'percent',
    value: 50,
    minSpend: 30,
    applicableBrandIds: ['dessert'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isUsed: false,
  },
  {
    id: 'coupon-5',
    name: '咖啡&甜品联合满100减25',
    type: 'fixed',
    value: 25,
    minSpend: 100,
    applicableBrandIds: ['coffee', 'dessert'],
    validFrom: '2026-06-01',
    validTo: '2026-08-31',
    isUsed: false,
  },
  {
    id: 'coupon-6',
    name: '新会员首单9折',
    type: 'percent',
    value: 10,
    minSpend: 0,
    applicableBrandIds: 'all',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isUsed: true,
  },
];

export const getCouponById = (id: string): Coupon | undefined => {
  return coupons.find(c => c.id === id);
};

export const getAvailableCoupons = (brandId?: string, total?: number): Coupon[] => {
  return coupons.filter(c => {
    if (c.isUsed) return false;
    const now = new Date();
    const validFrom = new Date(c.validFrom);
    const validTo = new Date(c.validTo);
    if (now < validFrom || now > validTo) return false;
    if (brandId && c.applicableBrandIds !== 'all' && !c.applicableBrandIds.includes(brandId as any)) return false;
    if (total !== undefined && c.minSpend > total) return false;
    return true;
  });
};
