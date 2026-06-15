import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { ProductCard } from '@/components/menu/ProductCard';
import { useCurrentBrand } from '@/store/useBrandStore';
import { getProductsByBrand, getProductsByCategory } from '@/data/products';
import { getCategoriesByBrand } from '@/data/categories';
import { AlertCircle } from 'lucide-react';

export function Menu() {
  const { brandId } = useParams<{ brandId: string }>();
  const [searchParams] = useSearchParams();
  const brand = useCurrentBrand();
  const categories = brandId ? getCategoriesByBrand(brandId) : [];
  const allProducts = brandId ? getProductsByBrand(brandId) : [];
  
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('category') || (categories[0]?.id || '')
  );
  
  const [displayProducts, setDisplayProducts] = useState(allProducts);

  useEffect(() => {
    if (activeCategory) {
      setDisplayProducts(getProductsByCategory(activeCategory));
    } else {
      setDisplayProducts(allProducts);
    }
  }, [activeCategory, allProducts]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  const inStockProducts = displayProducts.filter(p => !p.isOutOfStock);
  const outOfStockProducts = displayProducts.filter(p => p.isOutOfStock);

  if (!brand) {
    return <div className="flex items-center justify-center min-h-screen">品牌不存在</div>;
  }

  return (
    <div className="min-h-screen bg-brand-background pb-28">
      <Header />
      
      <div className="max-w-lg mx-auto">
        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <div className="px-4 py-4">
          {inStockProducts.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {inStockProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
          
          {outOfStockProducts.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <AlertCircle size={16} className="text-orange-500" />
                <h3 className="font-medium text-sm text-gray-500">
                  以下商品暂时售罄
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {outOfStockProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {displayProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">该分类暂无商品</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
