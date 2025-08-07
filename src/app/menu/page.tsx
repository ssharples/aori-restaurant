'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { menuItems, categoryNames } from '@/data/menu';
import { MenuCategory } from '@/types/menu';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';
import Cart from '@/components/Cart';
import FloatingBasketButton from '@/components/FloatingBasketButton';

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

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('gyros');
  const [searchQuery, setSearchQuery] = useState('');

  // Intersection Observer to update active category on scroll
  useEffect(() => {
    if (searchQuery) return; // Don't update during search

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const categoryId = entry.target.id as MenuCategory;
            if (categoryId && categories.includes(categoryId)) {
              setSelectedCategory(categoryId);
            }
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '-100px 0px -50% 0px'
      }
    );

    // Observe all category sections
    categories.forEach((category) => {
      const element = document.getElementById(category);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [searchQuery]);


  // Group items by category for all-items view
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<MenuCategory, typeof menuItems>);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Back Button */}
      <div className="fixed bottom-24 left-4 z-40 md:bottom-6">
        <Link 
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
      </div>

      {/* Floating Search Icon */}
      <div className="fixed bottom-24 right-4 z-40 md:bottom-6">
        <button
          onClick={() => {
            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
              searchBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Add a small delay to ensure scrolling completes before focusing
              setTimeout(() => {
                const input = searchBar.querySelector('input');
                if (input) input.focus();
              }, 300);
            }
          }}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Search menu"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Search Bar */}
      <div id="search-bar" className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Items */}
      <main className="px-4 pb-32">
        {searchQuery ? (
          // Search Results View
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {filteredItems.length} results for &quot;{searchQuery}&quot;
              </p>
            </div>
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">No items found</h3>
                <p className="text-gray-500">Try adjusting your search or browse other categories</p>
              </div>
            )}
          </div>
        ) : (
          // All Categories View
          <div className="space-y-8 py-4">
            {categories.map((category) => {
              const categoryItems = groupedItems[category];
              if (!categoryItems || categoryItems.length === 0) return null;
              
              return (
                <div key={category} id={category} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 font-heading">
                    {categoryNames[category]}
                  </h2>
                  <div className="space-y-4">
                    {categoryItems.map((item, index) => (
                      <MenuItemCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Basket Button */}
      <FloatingBasketButton />

      {/* Cart Drawer */}
      <Cart />
    </div>
  );
}