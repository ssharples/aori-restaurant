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
      className="bg-card border-b sticky top-20 z-30 shadow-sm"
    >
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-3">
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
                className="whitespace-nowrap rounded-full font-medium transition-all flex-shrink-0"
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