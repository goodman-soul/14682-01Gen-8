import type { Brand } from '@/types';

export const brands: Brand[] = [
  {
    id: 'coffee',
    name: 'Café Noir',
    slogan: '每一杯，都是匠心之作',
    logoUrl: '☕',
    description: '来自世界各地的精选咖啡豆，由资深咖啡师精心调配，为您带来醇厚香浓的咖啡体验。',
    theme: {
      primary: '#3E2723',
      secondary: '#D2691E',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#3E2723',
      textSecondary: '#795548',
      border: '#D7CCC8',
    },
    serviceRules: {
      allowDineIn: true,
      allowTakeout: true,
      dineInMinOrder: 0,
      takeoutDeliveryFee: 5,
    },
  },
  {
    id: 'bites',
    name: 'Fresh Bite',
    slogan: '新鲜每一天，健康每一餐',
    logoUrl: '🥗',
    description: '坚持选用当季新鲜食材，少油少盐的健康烹饪方式，让美味与健康兼得。',
    theme: {
      primary: '#4CAF50',
      secondary: '#FFC107',
      background: '#F1F8E9',
      surface: '#FFFFFF',
      text: '#1B5E20',
      textSecondary: '#689F38',
      border: '#C8E6C9',
    },
    serviceRules: {
      allowDineIn: true,
      allowTakeout: true,
      dineInMinOrder: 20,
      takeoutDeliveryFee: 3,
    },
  },
  {
    id: 'dessert',
    name: 'Sweet Delight',
    slogan: '甜蜜每一刻，幸福在口中',
    logoUrl: '🍰',
    description: '精选进口原料，由西点大师手工制作，每一款甜品都是艺术与美味的完美结合。',
    theme: {
      primary: '#E91E63',
      secondary: '#9C27B0',
      background: '#FCE4EC',
      surface: '#FFFFFF',
      text: '#880E4F',
      textSecondary: '#C2185B',
      border: '#F8BBD0',
    },
    serviceRules: {
      allowDineIn: true,
      allowTakeout: true,
      dineInMinOrder: 0,
      takeoutDeliveryFee: 4,
    },
  },
];

export const getBrandById = (id: string): Brand | undefined => {
  return brands.find(b => b.id === id);
};
