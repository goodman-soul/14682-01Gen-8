import { ShoppingBag, Sparkles } from 'lucide-react';
import { BrandCard } from '@/components/brand/BrandCard';
import { brands } from '@/data/brands';
import { useBrandStore } from '@/store/useBrandStore';

export function BrandSelect() {
  const currentBrandId = useBrandStore(state => state.currentBrandId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-800 mb-2">
            美食精选
          </h1>
          <p className="text-gray-500 flex items-center justify-center gap-1">
            <Sparkles size={16} className="text-amber-500" />
            选择您喜欢的品牌开始点餐
          </p>
        </div>
        
        <div className="space-y-6">
          {brands.map((brand, index) => (
            <div 
              key={brand.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BrandCard 
                brand={brand} 
                isCurrent={currentBrandId === brand.id}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            同一账户 · 共享会员 · 积分通兑
          </p>
        </div>
      </div>
    </div>
  );
}
