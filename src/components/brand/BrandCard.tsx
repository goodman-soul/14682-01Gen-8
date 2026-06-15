import { ArrowRight } from 'lucide-react';
import type { Brand } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useBrandSwitch } from '@/hooks/useBrandSwitch';

interface BrandCardProps {
  brand: Brand;
  isCurrent?: boolean;
}

export function BrandCard({ brand, isCurrent }: BrandCardProps) {
  const navigate = useNavigate();
  const { switchBrand } = useBrandSwitch();

  const gradientStyle = {
    background: `linear-gradient(135deg, ${brand.theme.primary} 0%, ${brand.theme.secondary} 100%)`,
  };

  const handleClick = () => {
    switchBrand(brand.id, `/brand/${brand.id}/menu`);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isCurrent ? 'ring-4 ring-offset-2' : ''
      }`}
      style={{ 
        ...gradientStyle,
        '--tw-ring-color': brand.theme.primary,
      } as React.CSSProperties}
    >
      <div className="p-8 text-white relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
            {brand.logoUrl}
          </span>
          {isCurrent && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              当前品牌
            </span>
          )}
        </div>
        
        <h3 className="font-display text-2xl font-bold mb-2">
          {brand.name}
        </h3>
        <p className="text-sm opacity-90 mb-4 leading-relaxed">
          {brand.description}
        </p>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium opacity-80 italic">
            「{brand.slogan}」
          </p>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transform group-hover:translate-x-1 transition-transform">
            <span className="text-sm font-medium">进入</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
      
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute -left-5 -top-5 w-24 h-24 bg-white/5 rounded-full blur-xl" />
    </div>
  );
}
