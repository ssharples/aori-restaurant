'use client';

import { MenuCategory } from '@/types/menu';
import { categoryNames } from '@/data/menu';
import { Button } from '@/components/ui/button';

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
    <div className="bg-card border-b sticky top-20 z-30 shadow-sm">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onCategoryChange(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className="whitespace-nowrap rounded-full font-medium transition-all transform hover:scale-105 flex-shrink-0"
            >
              {categoryNames[category]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}