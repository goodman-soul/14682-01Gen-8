import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/price';
import { useCartStore } from '@/store/useCartStore';

interface CartItemRowProps {
  item: CartItem;
  showBrand?: boolean;
  brandName?: string;
}

export function CartItemRow({ item, showBrand, brandName }: CartItemRowProps) {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  const specText = Object.entries(item.selectedSpecs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' · ');

  return (
    <div className={`flex gap-3 py-4 border-b border-brand-border last:border-b-0 ${
      item.isOutOfStock ? 'opacity-60' : ''
    }`}>
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={item.productImage} 
          alt={item.productName}
          className={`w-full h-full object-cover ${item.isOutOfStock ? 'grayscale' : ''}`}
        />
        {item.isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <AlertCircle size={16} className="text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {showBrand && brandName && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full mb-1 inline-block"
                style={{ 
                  backgroundColor: 'var(--brand-secondary)',
                  color: 'white',
                  opacity: 0.8
                }}
              >
                {brandName}
              </span>
            )}
            <h4 className={`font-medium text-sm ${
              item.isOutOfStock ? 'text-gray-400 line-through' : 'text-brand-text'
            }`}>
              {item.productName}
            </h4>
            {specText && (
              <p className="text-xs text-brand-text-secondary mt-0.5 truncate">
                {specText}
              </p>
            )}
            {item.isOutOfStock && (
              <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                商品已售罄，将从订单中移除
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-base" style={{ color: 'var(--brand-primary)' }}>
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
          
          {!item.isOutOfStock && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1 py-0.5">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} className="text-brand-text-secondary" />
              </button>
              <span className="w-6 text-center text-sm font-medium text-brand-text">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Plus size={14} className="text-brand-text-secondary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
