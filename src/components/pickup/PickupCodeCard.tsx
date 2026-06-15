import { Clock, QrCode, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { getBrandById } from '@/data/brands';
import { formatPrice } from '@/utils/price';

interface PickupCodeCardProps {
  order: Order;
}

const statusConfig: Record<OrderStatus, { text: string; color: string; bgColor: string }> = {
  pending: { text: '等待接单', color: '#F59E0B', bgColor: '#FEF3C7' },
  preparing: { text: '制作中', color: '#3B82F6', bgColor: '#DBEAFE' },
  ready: { text: '待取餐', color: '#10B981', bgColor: '#D1FAE5' },
  completed: { text: '已完成', color: '#6B7280', bgColor: '#F3F4F6' },
};

export function PickupCodeCard({ order }: PickupCodeCardProps) {
  const brand = getBrandById(order.brandId);
  const status = statusConfig[order.status];
  const estimatedTime = new Date(order.estimatedReadyAt);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in"
      style={{ 
        background: brand 
          ? `linear-gradient(135deg, ${brand.theme.primary} 0%, ${brand.theme.secondary} 100%)`
          : 'linear-gradient(135deg, #3E2723 0%, #D2691E 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white" />
      </div>
      
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{brand?.logoUrl}</span>
            <div>
              <h3 className="font-display text-xl font-bold">{brand?.name}</h3>
              <p className="text-sm opacity-80">{order.orderNo}</p>
            </div>
          </div>
          
          <span 
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{ backgroundColor: status.bgColor, color: status.color }}
          >
            {order.status === 'ready' ? <CheckCircle2 size={12} /> : null}
            {status.text}
          </span>
        </div>
        
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <p className="text-sm opacity-80 mb-2">取餐码</p>
            <div className={`text-6xl font-bold font-mono tracking-widest ${
              order.status === 'ready' ? 'animate-pulse' : ''
            }`}>
              {order.pickupCode}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Clock size={16} className="opacity-80" />
            <span className="text-sm">
              预计 {formatTime(estimatedTime)} 可取
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <QrCode size={16} className="opacity-80" />
            <span className="text-sm">
              合计 {formatPrice(order.totalAmount - order.discountAmount)}
            </span>
          </div>
          
          {order.status === 'ready' && (
            <button 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="刷新取餐码"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>
      
      {order.status === 'ready' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-ping opacity-20 bg-white rounded-2xl" />
        </div>
      )}
    </div>
  );
}
