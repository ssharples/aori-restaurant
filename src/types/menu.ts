export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  allergens?: string[];
  variants?: MenuItemVariant[];
  image?: string;
  popular?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export type MenuCategory = 
  | 'gyros'
  | 'souvlaki' 
  | 'bao-bun'
  | 'salad'
  | 'pita-dips'
  | 'sides'
  | 'desserts'
  | 'drinks';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  variant?: MenuItemVariant;
  quantity: number;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerDetails: CustomerDetails;
  collectionTime: Date;
  status: OrderStatus;
  paymentMethod: 'online' | 'at-restaurant';
  createdAt: Date;
  estimatedReadyTime: Date;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'collected'
  | 'cancelled';

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
}