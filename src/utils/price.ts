export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export const calculateDiscount = (
  total: number,
  couponType: 'percent' | 'fixed',
  couponValue: number
): number => {
  if (couponType === 'percent') {
    return total * (couponValue / 100);
  }
  return couponValue;
};

export const calculateFinalPrice = (
  total: number,
  couponType?: 'percent' | 'fixed',
  couponValue?: number
): number => {
  if (!couponType || couponValue === undefined) return total;
  const discount = calculateDiscount(total, couponType, couponValue);
  return Math.max(0, total - discount);
};
