import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/price';
import { OutOfStockBadge } from './OutOfStockBadge';
import { ProductSpecModal } from './ProductSpecModal';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showSpecModal, setShowSpecModal] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (specs: Record<string, string>, quantity: number) => {
    addItem({
      productId: product.id,
      brandId: product.brandId,
      productName: product.name,
      productImage: product.imageUrl,
      quantity,
      selectedSpecs: specs,
      unitPrice: product.price,
      isOutOfStock: product.isOutOfStock,
    });
  };

  const handleNotify = () => {
    alert(`已设置到货提醒：${product.name}`);
  };

  return (
    <>
      <div 
        className={`relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group ${
          product.isOutOfStock ? 'opacity-80' : ''
        }`}
      >
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${
              product.isOutOfStock ? 'grayscale' : ''
            }`}
            loading="lazy"
          />
          
          {product.originalPrice && !product.isOutOfStock && (
            <div 
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: 'var(--brand-secondary)' }}
            >
              特惠
            </div>
          )}
          
          {product.isOutOfStock && (
            <OutOfStockBadge onNotify={handleNotify} />
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-medium text-sm leading-tight line-clamp-1 ${
              product.isOutOfStock ? 'text-gray-400 line-through' : 'text-brand-text'
            }`}>
              {product.name}
            </h3>
            
            {product.isOutOfStock ? (
              <div className="flex items-center gap-0.5 text-xs text-orange-500 flex-shrink-0">
                <AlertCircle size={12} />
                <span>缺货</span>
              </div>
            ) : null}
          </div>
          
          <p className="text-xs text-brand-text-secondary line-clamp-2 mb-2 h-8">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {!product.isOutOfStock && (
              <button
                onClick={() => setShowSpecModal(true)}
                className="p-1.5 rounded-full text-white transition-all hover:opacity-90 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <ProductSpecModal
        product={product}
        isOpen={showSpecModal}
        onClose={() => setShowSpecModal(false)}
        onConfirm={handleAddToCart}
      />
    </>
  );
}
