'use client';

import { MenuCategory } from '@/types/menu';
import { categoryNames } from '@/data/menu';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-b sticky top-[60px] md:top-[72px] z-30 shadow-sm"
    >
      <div className="w-full relative">
        <div className="flex overflow-x-auto scrollbar-hide py-3 px-4 gap-2 md:gap-3 scroll-smooth">
          {/* Fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none z-10 md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10 md:hidden" />
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onCategoryChange(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className="whitespace-nowrap rounded-full font-medium transition-all flex-shrink-0 px-4 py-2 h-auto text-sm md:text-base min-w-[80px] touch-manipulation"
                size="sm"
              >
                {categoryNames[category]}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}