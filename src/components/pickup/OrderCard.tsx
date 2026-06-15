import { ChevronRight, Clock, Store } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { getBrandById } from '@/data/brands';
import { formatPrice } from '@/utils/price';

const statusConfig: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: '等待接单', color: '#F59E0B' },
  preparing: { text: '制作中', color: '#3B82F6' },
  ready: { text: '待取餐', color: '#10B981' },
  completed: { text: '已完成', color: '#6B7280' },
};

export function OrderCard({ order }: OrderCardProps) {
  const brand = getBrandById(order.brandId);
  const status = statusConfig[order.status];
  const createdDate = new Date(order.createdAt);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">{brand?.logoUrl}</span>
          <span className="font-semibold text-brand-text">{brand?.name}</span>
          <span className="text-xs text-gray-400">{order.orderNo}</span>
        </div>
        <span 
          className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: `${status.color}15`, color: status.color }}
        >
          {status.text}
        </span>
      </div>
      
      <div className="p-4">
        <div className="space-y-2 mb-3">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-brand-text-secondary">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-brand-text font-medium">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-400 text-center">
              还有 {order.items.length - 3} 件商品
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(createdDate)}
            </span>
            <span className="flex items-center gap-1">
              <Store size={12} />
              {order.serviceType === 'dineIn' ? '堂食' : '外带'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
              {formatPrice(order.totalAmount - order.discountAmount)}
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
