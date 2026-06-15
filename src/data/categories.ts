import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'coffee-1', brandId: 'coffee', name: '浓缩咖啡', sortOrder: 1 },
  { id: 'coffee-2', brandId: 'coffee', name: '拿铁系列', sortOrder: 2 },
  { id: 'coffee-3', brandId: 'coffee', name: '卡布奇诺', sortOrder: 3 },
  { id: 'coffee-4', brandId: 'coffee', name: '手冲咖啡', sortOrder: 4 },
  { id: 'coffee-5', brandId: 'coffee', name: '冰饮特调', sortOrder: 5 },
  { id: 'coffee-6', brandId: 'coffee', name: '甜点搭配', sortOrder: 6 },

  { id: 'bites-1', brandId: 'bites', name: '健康沙拉', sortOrder: 1 },
  { id: 'bites-2', brandId: 'bites', name: '三明治', sortOrder: 2 },
  { id: 'bites-3', brandId: 'bites', name: '意面套餐', sortOrder: 3 },
  { id: 'bites-4', brandId: 'bites', name: '轻食小食', sortOrder: 4 },
  { id: 'bites-5', brandId: 'bites', name: '谷物碗', sortOrder: 5 },
  { id: 'bites-6', brandId: 'bites', name: '鲜榨果汁', sortOrder: 6 },

  { id: 'dessert-1', brandId: 'dessert', name: '经典蛋糕', sortOrder: 1 },
  { id: 'dessert-2', brandId: 'dessert', name: '法式甜点', sortOrder: 2 },
  { id: 'dessert-3', brandId: 'dessert', name: '冰淇淋', sortOrder: 3 },
  { id: 'dessert-4', brandId: 'dessert', name: '曲奇饼干', sortOrder: 4 },
  { id: 'dessert-5', brandId: 'dessert', name: '巧克力', sortOrder: 5 },
  { id: 'dessert-6', brandId: 'dessert', name: '节日限定', sortOrder: 6 },
];

export const getCategoriesByBrand = (brandId: string): Category[] => {
  return categories
    .filter(c => c.brandId === brandId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};
