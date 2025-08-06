// Menu Synchronization Service
// Keeps local menu data in sync with EPOS Now

import { enhancedEposAPI } from './epos-api-enhanced';
import type { EposProduct, EposCategory } from './epos-api-enhanced';
import type { MenuItem, MenuCategory } from '@/types/menu';

interface MenuSyncOptions {
  forceSync?: boolean;
  syncImages?: boolean;
  updatePrices?: boolean;
  syncAvailability?: boolean;
}

interface SyncMapping {
  eposId: number;
  localId: string;
  category: MenuCategory;
  needsUpdate: boolean;
}

class MenuSyncService {
  private lastSyncTime: Date | null = null;
  private syncInProgress = false;
  private syncMappings: SyncMapping[] = [];

  constructor() {
    // Load last sync time from localStorage if available
    if (typeof window !== 'undefined') {
      const lastSync = localStorage.getItem('menu_last_sync');
      if (lastSync) {
        this.lastSyncTime = new Date(lastSync);
      }
    }
  }

  async syncMenu(options: MenuSyncOptions = {}): Promise<{
    success: boolean;
    itemsUpdated: number;
    categoriesUpdated: number;
    errors: string[];
    lastSyncTime: Date;
  }> {
    if (this.syncInProgress) {
      throw new Error('Menu sync already in progress');
    }

    this.syncInProgress = true;
    const errors: string[] = [];
    let itemsUpdated = 0;
    let categoriesUpdated = 0;

    try {
      console.log('Starting menu synchronization with EPOS Now...');

      // Get data from EPOS Now
      const eposData = await enhancedEposAPI.syncMenuFromEpos();
      
      // Get stock levels if syncing availability
      let stockLevels: Array<{ ProductId: number; Quantity: number }> = [];
      if (options.syncAvailability) {
        try {
          const eposStockLevels = await enhancedEposAPI.getStockLevels();
          stockLevels = eposStockLevels.map(stock => ({
            ProductId: stock.ProductId,
            Quantity: stock.Quantity
          }));
        } catch (error) {
          console.warn('Failed to fetch stock levels:', error);
          errors.push('Stock levels unavailable');
        }
      }

      // Process categories
      const categoryMappings = this.mapEposCategoriesToLocal(eposData.categories);
      categoriesUpdated = categoryMappings.length;

      // Process products
      for (const eposProduct of eposData.products) {
        try {
          const localMenuItem = await this.convertEposProductToMenuItem(
            eposProduct, 
            eposData.categories,
            stockLevels,
            options
          );
          
          if (localMenuItem) {
            await this.updateLocalMenuItem(localMenuItem);
            itemsUpdated++;
          }
        } catch (error) {
          const errorMsg = `Failed to sync product ${eposProduct.Name}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      // Update sync time
      this.lastSyncTime = new Date();
      if (typeof window !== 'undefined') {
        localStorage.setItem('menu_last_sync', this.lastSyncTime.toISOString());
      }

      console.log(`Menu sync completed: ${itemsUpdated} items, ${categoriesUpdated} categories updated`);

      return {
        success: true,
        itemsUpdated,
        categoriesUpdated,
        errors,
        lastSyncTime: this.lastSyncTime
      };

    } catch (error) {
      console.error('Menu sync failed:', error);
      errors.push(`Sync failed: ${error}`);
      
      return {
        success: false,
        itemsUpdated,
        categoriesUpdated,
        errors,
        lastSyncTime: this.lastSyncTime || new Date()
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private mapEposCategoriesToLocal(eposCategories: EposCategory[]): { eposId: number; localCategory: MenuCategory }[] {
    const mappings: { eposId: number; localCategory: MenuCategory }[] = [];
    
    const categoryMap: { [key: string]: MenuCategory } = {
      'gyros': 'gyros',
      'souvlaki': 'souvlaki',
      'bao': 'bao-bun',
      'bao bun': 'bao-bun',
      'salad': 'salad',
      'salads': 'salad',
      'pita': 'pita-dips',
      'dips': 'pita-dips',
      'sides': 'sides',
      'side': 'sides',
      'dessert': 'desserts',
      'desserts': 'desserts',
      'drinks': 'drinks',
      'drink': 'drinks',
      'beverage': 'drinks',
      'beverages': 'drinks'
    };

    for (const category of eposCategories) {
      const categoryName = category.Name.toLowerCase();
      const localCategory = categoryMap[categoryName];
      
      if (localCategory) {
        mappings.push({
          eposId: category.Id,
          localCategory
        });
      }
    }

    return mappings;
  }

  private async convertEposProductToMenuItem(
    eposProduct: EposProduct,
    categories: EposCategory[],
    stockLevels: Array<{ ProductId: number; Quantity: number }>,
    options: MenuSyncOptions
  ): Promise<MenuItem | null> {
    try {
      // Find category mapping
      const category = categories.find(cat => cat.Id === eposProduct.CategoryId);
      const localCategory = this.getLocalCategoryFromEpos(category?.Name || '');
      
      if (!localCategory) {
        console.warn(`No local category mapping for EPOS product: ${eposProduct.Name}`);
        return null;
      }

      // Check stock availability
      let isAvailable = true;
      if (options.syncAvailability && eposProduct.IsStockManaged) {
        const stock = stockLevels.find(s => s.ProductId === eposProduct.Id);
        isAvailable = stock ? stock.Quantity > 0 : false;
      }

      // Generate local menu item
      const menuItem: MenuItem = {
        id: this.generateLocalId(eposProduct.Id, eposProduct.Name),
        name: eposProduct.Name,
        description: this.enhanceDescription(eposProduct, localCategory),
        price: eposProduct.Price,
        category: localCategory,
        image: this.getImageUrl(eposProduct, localCategory),
        allergens: this.extractAllergens(eposProduct),
        variants: this.generateVariants(eposProduct, localCategory),
        popular: this.isPopularItem(eposProduct.Name),
        vegetarian: this.isVegetarian(eposProduct.Name, eposProduct.Description),
        available: isAvailable,
        eposId: eposProduct.Id,
        lastUpdated: new Date().toISOString()
      };

      return menuItem;
    } catch (error) {
      console.error(`Failed to convert EPOS product ${eposProduct.Name}:`, error);
      return null;
    }
  }

  private getLocalCategoryFromEpos(eposCategory: string): MenuCategory | null {
    const categoryName = eposCategory.toLowerCase();
    
    if (categoryName.includes('gyros')) return 'gyros';
    if (categoryName.includes('souvlaki')) return 'souvlaki';
    if (categoryName.includes('bao')) return 'bao-bun';
    if (categoryName.includes('salad')) return 'salad';
    if (categoryName.includes('pita') || categoryName.includes('dip')) return 'pita-dips';
    if (categoryName.includes('side')) return 'sides';
    if (categoryName.includes('dessert')) return 'desserts';
    if (categoryName.includes('drink') || categoryName.includes('beverage')) return 'drinks';
    
    return null;
  }

  private generateLocalId(eposId: number, productName: string): string {
    const sanitized = productName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${sanitized}-${eposId}`;
  }

  private enhanceDescription(product: EposProduct, category: MenuCategory): string {
    let description = product.Description || '';
    
    // Add category-specific enhancements
    const enhancements: { [key in MenuCategory]?: string } = {
      'gyros': 'Served in warm pita with chips, tomatoes, onions & tzatziki',
      'souvlaki': 'Grilled to perfection on charcoal skewers',
      'bao-bun': 'Soft steamed bun with fresh ingredients',
      'salad': 'Fresh crisp ingredients with our homemade dressing',
      'pita-dips': 'Served with warm pita bread',
      'sides': 'Perfect accompaniment to any main dish',
      'desserts': 'Homemade sweet treats',
      'drinks': 'Refreshing beverages'
    };

    const enhancement = enhancements[category];
    if (enhancement && !description.includes(enhancement)) {
      description = description ? `${description}. ${enhancement}` : enhancement;
    }

    return description;
  }

  private getImageUrl(product: EposProduct, category: MenuCategory): string {
    // If product has image from EPOS, use it
    if (product.Image) {
      return product.Image;
    }

    // Generate placeholder based on category and product name
    const imageMap: { [key: string]: string } = {
      'chicken-gyros': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
      'pork-gyros': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      'chicken-souvlaki': 'https://images.unsplash.com/photo-1633336219217-df7a3db37f09?w=400&h=300&fit=crop',
      'pork-souvlaki': 'https://images.unsplash.com/photo-1551218370-4570e03c39b4?w=400&h=300&fit=crop',
      'greek-salad': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      'caesar-salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
    };

    console.log(`Generating image for category: ${category}, product: ${product.Name}`);
    const productKey = this.generateLocalId(0, product.Name).replace(/-\d+$/, '');
    return imageMap[productKey] || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop`;
  }

  private extractAllergens(product: EposProduct): string[] {
    const allergens: string[] = [];
    const description = `${product.Name} ${product.Description || ''}`.toLowerCase();

    const allergenMap: { [key: string]: string } = {
      'peanut': 'peanuts',
      'nut': 'nuts',
      'gluten': 'gluten',
      'wheat': 'gluten',
      'dairy': 'dairy',
      'milk': 'dairy',
      'cheese': 'dairy',
      'egg': 'eggs',
      'fish': 'fish',
      'shellfish': 'shellfish',
      'soy': 'soy',
      'sesame': 'sesame'
    };

    for (const [trigger, allergen] of Object.entries(allergenMap)) {
      if (description.includes(trigger) && !allergens.includes(allergen)) {
        allergens.push(allergen);
      }
    }

    return allergens;
  }

  private generateVariants(product: EposProduct, category: MenuCategory): Array<{id: string; name: string; price: number}> {
    const variants: Array<{id: string; name: string; price: number}> = [];

    // Add category-specific variants
    if (category === 'gyros' || category === 'souvlaki') {
      if (product.Name.toLowerCase().includes('gyros')) {
        variants.push(
          { id: `${product.Id}-wrap`, name: 'Wrap', price: product.Price },
          { id: `${product.Id}-box`, name: 'Box Meal', price: product.Price + 5 }
        );
      } else if (product.Name.toLowerCase().includes('souvlaki')) {
        variants.push(
          { id: `${product.Id}-skewer`, name: 'Per Skewer', price: product.Price },
          { id: `${product.Id}-box`, name: 'Box Meal', price: product.Price + 6.5 }
        );
      }
    }

    return variants;
  }

  private isPopularItem(productName: string): boolean {
    const popularItems = ['chicken gyros', 'pork souvlaki', 'greek salad', 'tzatziki'];
    return popularItems.some(item => productName.toLowerCase().includes(item));
  }

  private isVegetarian(productName: string, description?: string): boolean {
    const text = `${productName} ${description || ''}`.toLowerCase();
    const meatTerms = ['chicken', 'pork', 'beef', 'lamb', 'fish', 'prawns', 'bacon'];
    const vegTerms = ['halloumi', 'veggie', 'vegetarian', 'salad'];
    
    return !meatTerms.some(term => text.includes(term)) || vegTerms.some(term => text.includes(term));
  }

  private async updateLocalMenuItem(menuItem: MenuItem): Promise<void> {
    // This would typically update your local database or state
    // For now, we'll store in localStorage as an example
    if (typeof window !== 'undefined') {
      const existingMenu = JSON.parse(localStorage.getItem('synced_menu') || '[]');
      const existingIndex = existingMenu.findIndex((item: MenuItem) => item.id === menuItem.id);
      
      if (existingIndex >= 0) {
        existingMenu[existingIndex] = menuItem;
      } else {
        existingMenu.push(menuItem);
      }
      
      localStorage.setItem('synced_menu', JSON.stringify(existingMenu));
    }

    console.log(`Updated local menu item: ${menuItem.name}`);
  }

  // Public methods for menu management
  async shouldSync(): Promise<boolean> {
    if (!this.lastSyncTime) return true;
    
    // Sync if last sync was more than 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.lastSyncTime < oneHourAgo;
  }

  async scheduleAutoSync(): Promise<void> {
    // Check if sync is needed every 30 minutes
    const checkInterval = 30 * 60 * 1000; // 30 minutes
    
    setInterval(async () => {
      if (await this.shouldSync()) {
        try {
          await this.syncMenu();
          console.log('Auto-sync completed successfully');
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    }, checkInterval);
  }

  getSyncStatus(): {
    lastSync: Date | null;
    inProgress: boolean;
    nextScheduledSync: Date | null;
  } {
    const nextSync = this.lastSyncTime 
      ? new Date(this.lastSyncTime.getTime() + 60 * 60 * 1000) // 1 hour from last sync
      : new Date();

    return {
      lastSync: this.lastSyncTime,
      inProgress: this.syncInProgress,
      nextScheduledSync: nextSync
    };
  }
}

// Singleton instance
export const menuSyncService = new MenuSyncService();

// Auto-start sync scheduling in browser environment
if (typeof window !== 'undefined') {
  menuSyncService.scheduleAutoSync();
}