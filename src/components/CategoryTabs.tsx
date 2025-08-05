'use client';

import { MenuCategory } from '@/types/menu';
import { categoryNames } from '@/data/menu';

interface CategoryTabsProps {
  selectedCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}

const categories: MenuCategory[] = [
  'gyros',
  'souvlaki',
  'bao-bun',
  'salad',
  'pita-dips',
  'sides',
  'desserts',
  'drinks'
];

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="bg-aori-white border-b border-aori-green/10 sticky top-20 z-30 shadow-sm">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                whitespace-nowrap px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105
                ${selectedCategory === category
                  ? 'bg-aori-green text-aori-white shadow-md'
                  : 'bg-aori-cream text-aori-dark hover:bg-aori-green/10 hover:text-aori-green border border-aori-green/20'
                }
              `}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}