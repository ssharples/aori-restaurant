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
    <div className="bg-accent-white border-b sticky top-16 z-30">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide py-3 px-4 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-primary-green text-accent-white shadow-md'
                  : 'bg-gray-100 text-primary-dark hover:bg-gray-200'
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