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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-logo font-bold">Menu</h1>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-card border-b p-4">
        <div className="container mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-input placeholder:text-muted-foreground text-card-foreground"
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
          <h2 className="text-3xl font-bold text-foreground">
            {categoryNames[selectedCategory]}
          </h2>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground bg-card px-4 py-2 rounded-full inline-block border">
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
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or browse other categories</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <Cart />
    </div>
  );
}