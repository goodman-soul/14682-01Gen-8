export type BrandId = 'coffee' | 'bites' | 'dessert';

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ServiceRules {
  allowDineIn: boolean;
  allowTakeout: boolean;
  dineInMinOrder?: number;
  takeoutDeliveryFee?: number;
}

export interface Brand {
  id: BrandId;
  name: string;
  slogan: string;
  logoUrl: string;
  description: string;
  theme: Theme;
  serviceRules: ServiceRules;
}

export interface Category {
  id: string;
  brandId: BrandId;
  name: string;
  sortOrder: number;
}

export interface ProductSpec {
  name: string;
  options: string[];
  defaultOption?: string;
}

export interface Product {
  id: string;
  brandId: BrandId;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isOutOfStock: boolean;
  specs: ProductSpec[];
}

export interface CartItem {
  id: string;
  productId: string;
  brandId: BrandId;
  productName: string;
  productImage: string;
  quantity: number;
  selectedSpecs: Record<string, string>;
  unitPrice: number;
  isOutOfStock: boolean;
}

export interface Coupon {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend: number;
  applicableBrandIds: BrandId[] | 'all';
  validFrom: string;
  validTo: string;
  isUsed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  spec: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';
export type ServiceType = 'dineIn' | 'takeout';

export interface Order {
  id: string;
  orderNo: string;
  brandId: BrandId;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  serviceType: ServiceType;
  status: OrderStatus;
  pickupCode: string;
  createdAt: string;
  estimatedReadyAt: string;
}

export interface CartState {
  items: CartItem[];
  appliedCouponId: string | null;
  getBrandItems: (brandId: BrandId) => CartItem[];
  getBrandTotal: (brandId: BrandId) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getDiscountedAmount: () => number;
}
