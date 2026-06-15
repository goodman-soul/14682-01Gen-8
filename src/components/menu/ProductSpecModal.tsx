import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/price';

interface ProductSpecModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (specs: Record<string, string>, quantity: number) => void;
}

export function ProductSpecModal({ product, isOpen, onClose, onConfirm }: ProductSpecModalProps) {
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    product.specs.forEach(spec => {
      if (spec.defaultOption) {
        defaults[spec.name] = spec.defaultOption;
      } else if (spec.options.length > 0) {
        defaults[spec.name] = spec.options[0];
      }
    });
    return defaults;
  });
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleSpecChange = (specName: string, value: string) => {
    setSelectedSpecs(prev => ({ ...prev, [specName]: value }));
  };

  const handleConfirm = () => {
    onConfirm(selectedSpecs, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <X size={20} />
          </button>
          
          {product.originalPrice && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: 'var(--brand-secondary)' }}
            >
              省 ¥{(product.originalPrice - product.price).toFixed(0)}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-brand-text mb-2">
              {product.name}
            </h2>
            <p className="text-brand-text-secondary text-sm leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          {product.specs.map((spec) => (
            <div key={spec.name} className="mb-6">
              <h3 className="font-semibold text-brand-text mb-3">
                {spec.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {spec.options.map((option) => {
                  const isSelected = selectedSpecs[spec.name] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSpecChange(spec.name, option)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected 
                          ? 'text-white shadow-md' 
                          : 'bg-gray-50 text-brand-text-secondary border border-gray-200 hover:border-brand-primary/30'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--brand-primary)' : undefined,
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="font-medium text-brand-text">数量</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className="text-brand-text-secondary" />
                </button>
                <span className="w-8 text-center font-semibold text-brand-text">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} className="text-brand-text-secondary" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleConfirm}
              className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              加入购物车 · {formatPrice(product.price * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
