import { useLocation, useParams } from 'react-router-dom';
import { QrCode, Clock, CheckCircle2, Package } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { PickupCodeCard } from '@/components/pickup/PickupCodeCard';
import { OrderCard } from '@/components/pickup/OrderCard';
import { useOrderStore } from '@/store/useOrderStore';
import { useBrandStore } from '@/store/useBrandStore';
import { brands } from '@/data/brands';
import { useEffect, useState } from 'react';
import type { BrandId } from '@/types';

export function Pickup() {
  const location = useLocation();
  const { brandId: routeBrandId } = useParams<{ brandId: string }>();
  const storeBrandId = useBrandStore(state => state.currentBrandId);
  const { orders, getActivePickupCode, getOrdersByBrand } = useOrderStore();
  
  const [justOrdered, setJustOrdered] = useState(false);
  
  useEffect(() => {
    if (location.state?.orderId) {
      setJustOrdered(true);
      const timer = setTimeout(() => setJustOrdered(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const activeOrder = orders.find(o => o.status === 'ready' || o.status === 'preparing' || o.status === 'pending');
  const readyOrder = orders.find(o => o.status === 'ready');
  const validBrandId = routeBrandId && brands.find(b => b.id === routeBrandId)
    ? routeBrandId as BrandId
    : storeBrandId;
  const brandOrders = validBrandId ? getOrdersByBrand(validBrandId) : orders;
  const historyOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-brand-background pb-20">
      <Header title="取餐" showSearch={false} />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {justOrdered && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <p className="text-sm font-medium text-green-800">
                下单成功！请稍候，我们正在为您准备
              </p>
            </div>
          </div>
        )}
        
        {readyOrder && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <QrCode size={20} style={{ color: 'var(--brand-primary)' }} />
              <h2 className="font-display text-lg font-bold text-brand-text">当前取餐码</h2>
            </div>
            <PickupCodeCard order={readyOrder} />
          </div>
        )}
        
        {activeOrder && activeOrder.status !== 'ready' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={20} style={{ color: 'var(--brand-primary)' }} />
              <h2 className="font-display text-lg font-bold text-brand-text">制作中</h2>
            </div>
            <PickupCodeCard order={activeOrder} />
          </div>
        )}
        
        {!readyOrder && !activeOrder && (
          <div className="text-center py-12 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={36} className="text-gray-300" />
            </div>
            <p className="text-gray-500">暂无待取餐订单</p>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-gray-400" />
            <h2 className="font-display text-lg font-bold text-brand-text">历史订单</h2>
          </div>
          
          {historyOrders.length > 0 ? (
            <div className="space-y-4">
              {historyOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl">
              <p className="text-gray-400 text-sm">暂无历史订单</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
