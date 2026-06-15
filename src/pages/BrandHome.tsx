import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ChevronRight, Flame, Clock, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ProductCard } from '@/components/menu/ProductCard';
import { useBrandStore } from '@/store/useBrandStore';
import { brands } from '@/data/brands';
import { getProductsByBrand } from '@/data/products';
import { getCategoriesByBrand } from '@/data/categories';
import type { BrandId } from '@/types';

export function BrandHome() {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const setCurrentBrand = useBrandStore(state => state.setCurrentBrand);
  const brand = brands.find(b => b.id === brandId);

  useEffect(() => {
    if (brandId && brands.find(b => b.id === brandId)) {
      setCurrentBrand(brandId as BrandId);
    }
  }, [brandId, setCurrentBrand]);

  const products = useMemo(
    () => (brandId ? getProductsByBrand(brandId) : []),
    [brandId]
  );

  const categories = useMemo(
    () => (brandId ? getCategoriesByBrand(brandId) : []),
    [brandId]
  );

  const recommendedProducts = useMemo(
    () => products.filter(p => !p.isOutOfStock).slice(0, 4),
    [products]
  );

  const hotProducts = useMemo(
    () => products.filter(p => !p.isOutOfStock).slice(2, 6),
    [products]
  );

  if (!brand) {
    return <div className="flex items-center justify-center min-h-screen">品牌不存在</div>;
  }

  return (
    <div className="min-h-screen bg-brand-background pb-20">
      <Header showBack={false} />

      <div className="max-w-lg mx-auto">
        <div
          className="relative h-48 mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${brand.theme.primary} 0%, ${brand.theme.secondary} 100%)`
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white" />
          </div>

          <div className="relative h-full flex items-center justify-between p-6 text-white">
            <div>
              <span className="text-6xl mb-2 block">{brand.logoUrl}</span>
              <h2 className="font-display text-2xl font-bold">{brand.name}</h2>
              <p className="text-sm opacity-80">{brand.slogan}</p>
            </div>
            <button
              onClick={() => navigate(`/brand/${brandId}/menu`)}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
            >
              查看菜单
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-around px-4 py-6">
          {[
            { icon: Flame, label: '人气推荐', count: 12 },
            { icon: Clock, label: '预计时间', count: '15分钟' },
            { icon: Star, label: '评分', count: '4.9' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: `${brand.theme.primary}15` }}
              >
                <item.icon size={20} style={{ color: brand.theme.primary }} />
              </div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-semibold text-brand-text">{item.count}</p>
            </div>
          ))}
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-brand-text flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              人气推荐
            </h3>
            <button
              onClick={() => navigate(`/brand/${brandId}/menu`)}
              className="text-sm text-brand-text-secondary flex items-center gap-1"
            >
              查看全部 <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-brand-text">
              快速分类
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map(category => (
              <button
                key={category.id}
                onClick={() => navigate(`/brand/${brandId}/menu?category=${category.id}`)}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm font-medium text-brand-text">{category.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {products.filter(p => p.categoryId === category.id).length}件
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold text-brand-text">
              新品上市
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {hotProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
