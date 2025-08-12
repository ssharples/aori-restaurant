'use client';

import { MenuCategory } from '@/types/menu';
import { categoryNames } from '@/data/menu';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Auto-scroll the selected tab into view
  useEffect(() => {
    const selectedButton = buttonRefs.current[selectedCategory];
    const container = scrollContainerRef.current;
    
    if (selectedButton && container) {
      const buttonRect = selectedButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate if the button is out of view
      const isOutOfView = 
        buttonRect.left < containerRect.left || 
        buttonRect.right > containerRect.right;
      
      if (isOutOfView) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selectedCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-aori-green/20 sticky top-0 z-30 shadow-sm"
    >
      <div className="w-full relative">
        <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide px-4 scroll-smooth">
          {/* Fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-aori-green/30 to-transparent pointer-events-none z-10 md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-aori-green/30 to-transparent pointer-events-none z-10 md:hidden" />
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
                  ref={(el) => { buttonRefs.current[category] = el; }}
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
                      ? 'text-aori-green border-b-2 border-aori-green bg-aori-green/10 font-semibold' 
                      : 'text-gray-600 hover:text-aori-green hover:bg-aori-green/5'
                    }
                    touch-manipulation focus:outline-none focus:ring-0 focus:border-0
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