import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import type { BrandId, CartItem } from '@/types';
import { CartItemRow } from './CartItemRow';
import { useCartStore } from '@/store/useCartStore';
import { getBrandById } from '@/data/brands';
import { formatPrice } from '@/utils/price';

interface BrandGroupProps {
  brandId: BrandId;
  items: CartItem[];
  defaultExpanded?: boolean;
}

export function BrandGroup({ brandId, items, defaultExpanded = true }: BrandGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const clearBrandItems = useCartStore(state => state.clearBrandItems);
  const getBrandTotal = useCartStore(state => state.getBrandTotal);
  
  const brand = getBrandById(brandId);
  const total = getBrandTotal(brandId);

  if (!brand) return null;

  const inStockItems = items.filter(i => !i.isOutOfStock);
  const outOfStockItems = items.filter(i => i.isOutOfStock);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        style={{ backgroundColor: `${brand.theme.primary}08` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{brand.logoUrl}</span>
          <div>
            <h3 className="font-semibold text-brand-text">{brand.name}</h3>
            <p className="text-xs text-brand-text-secondary">
              {inStockItems.length}件商品 · {outOfStockItems.length > 0 && `${outOfStockItems.length}件缺货`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg" style={{ color: brand.theme.primary }}>
            {formatPrice(total)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearBrandItems(brandId);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
          {expanded ? (
            <ChevronUp size={20} className="text-brand-text-secondary" />
          ) : (
            <ChevronDown size={20} className="text-brand-text-secondary" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 animate-fade-in">
          {inStockItems.map(item => (
            <CartItemRow 
              key={item.id} 
              item={item} 
            />
          ))}
          {outOfStockItems.length > 0 && (
            <div className="pt-2 border-t border-dashed border-gray-200 mt-2">
              <p className="text-xs text-orange-500 mb-2 flex items-center gap-1">
                以下商品已售罄，结算时将自动移除
              </p>
              {outOfStockItems.map(item => (
                <CartItemRow 
                  key={item.id} 
                  item={item} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
