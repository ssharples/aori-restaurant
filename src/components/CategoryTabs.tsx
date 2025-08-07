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
      className="bg-white border-b border-gray-200 sticky top-[60px] md:top-[72px] z-30 shadow-sm"
    >
      <div className="w-full relative">
        <div className="flex overflow-x-auto scrollbar-hide px-4 scroll-smooth">
          {/* Fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative flex-shrink-0"
              >
                <button
                  onClick={() => {
                    onCategoryChange(category);
                    // Scroll to category section
                    const element = document.getElementById(category);
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                  className={`
                    whitespace-nowrap font-medium transition-all px-4 py-4 text-sm
                    ${isSelected 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-600 hover:text-black'
                    }
                    touch-manipulation
                  `}
                >
                  {categoryNames[category]}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}