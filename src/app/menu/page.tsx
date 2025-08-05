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
    <div className="min-h-screen bg-aori-cream">
      {/* Header */}
      <header className="bg-aori-green text-aori-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 hover:bg-aori-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-logo font-bold">Menu</h1>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-aori-white border-b border-aori-green/10 p-4">
        <div className="container mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-aori-green/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-aori-green/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aori-green focus:border-aori-green bg-aori-cream/50 placeholder:text-aori-green/60 text-aori-dark"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-aori-dark">
            {categoryNames[selectedCategory]}
          </h2>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <p className="text-aori-dark/60 bg-aori-white px-4 py-2 rounded-full inline-block">
              {filteredItems.length} results for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        <div className="space-y-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-aori-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-aori-green/40" />
            </div>
            <h3 className="text-xl font-semibold text-aori-dark mb-2">No items found</h3>
            <p className="text-aori-dark/60">Try adjusting your search or browse other categories</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <Cart />
    </div>
  );
}