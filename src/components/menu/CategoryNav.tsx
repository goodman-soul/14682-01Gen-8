import type { Category } from '@/types';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategoryId, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="sticky top-[72px] z-30 bg-brand-background/95 backdrop-blur-sm border-b border-brand-border">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                isActive 
                  ? 'text-white shadow-lg transform scale-105' 
                  : 'bg-white text-brand-text-secondary hover:bg-gray-50 border border-brand-border'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--brand-primary)' : undefined,
                boxShadow: isActive ? '0 4px 14px -4px var(--brand-primary)' : undefined,
              }}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
