'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { menuItems, categoryNames } from '@/data/menu';
import { MenuCategory } from '@/types/menu';
import CartButton from '@/components/CartButton';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';
import Cart from '@/components/Cart';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('gyros');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-accent-cream">
      {/* Header */}
      <header className="bg-primary-green text-accent-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 hover:bg-primary-green/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-logo font-bold">Menu</h1>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-accent-white border-b p-4">
        <div className="container mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-primary-dark">
            {categoryNames[selectedCategory]}
          </h2>
        </div>

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredItems.length} results for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <Cart />
    </div>
  );
}