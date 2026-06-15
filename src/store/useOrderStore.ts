import { create } from 'zustand';
import type { Order, BrandId, OrderItem, ServiceType, OrderStatus } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

interface OrderStore {
  orders: Order[];
  currentPickupCode: string | null;
  
  createOrder: (
    brandId: BrandId,
    items: OrderItem[],
    totalAmount: number,
    discountAmount: number,
    serviceType: ServiceType
  ) => Order;
  
  getOrdersByBrand: (brandId: BrandId) => Order[];
  getActivePickupCode: () => string | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const generateOrderNo = () => {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

const generatePickupCode = () => {
  return Math.floor(100 + Math.random() * 900).toString();
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []),
  currentPickupCode: null,

  createOrder: (brandId, items, totalAmount, discountAmount, serviceType) => {
    const now = new Date();
    const estimatedReady = new Date(now.getTime() + 15 * 60 * 1000);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      orderNo: generateOrderNo(),
      brandId,
      items,
      totalAmount,
      discountAmount,
      serviceType,
      status: 'pending',
      pickupCode: generatePickupCode(),
      createdAt: now.toISOString(),
      estimatedReadyAt: estimatedReady.toISOString(),
    };
    
    const newOrders = [newOrder, ...get().orders];
    set({ orders: newOrders, currentPickupCode: newOrder.pickupCode });
    saveToStorage(STORAGE_KEYS.ORDERS, newOrders);
    
    setTimeout(() => {
      get().updateOrderStatus(newOrder.id, 'preparing');
    }, 3000);
    
    setTimeout(() => {
      get().updateOrderStatus(newOrder.id, 'ready');
    }, 10000);
    
    return newOrder;
  },

  getOrdersByBrand: (brandId) => {
    return get().orders.filter(o => o.brandId === brandId);
  },

  getActivePickupCode: () => {
    const readyOrder = get().orders.find(o => o.status === 'ready');
    return readyOrder?.pickupCode || null;
  },

  updateOrderStatus: (orderId, status) => {
    const newOrders = get().orders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    set({ orders: newOrders });
    saveToStorage(STORAGE_KEYS.ORDERS, newOrders);
  },
}));
