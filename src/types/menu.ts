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
  available?: boolean;
  eposId?: number;
  lastUpdated?: string;
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
  // Optional participant assignment for group orders
  participantId?: string;
  participantName?: string;
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
  // Table service fields
  orderType: 'collection' | 'table-service';
  tableNumber?: number;
  tableId?: number; // EPOS Now TableID
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

// Group ordering types
export interface GroupParticipant {
  id: string;
  name: string;
  isHost?: boolean;
  joinedAt?: Date;
  lastActive?: Date;
  color?: string; // For UI distinction
}

export interface GroupSplitSummary {
  participantId: string;
  participantName: string;
  subtotal: number;
  itemCount: number;
}

// Group session types
export interface GroupSession {
  id: string;
  hostId: string;
  hostName: string;
  title?: string;
  createdAt: Date;
  expiresAt: Date;
  status: GroupSessionStatus;
  participants: GroupParticipant[];
  items: CartItem[];
  shareableLink: string;
  qrCodeUrl?: string;
  maxParticipants?: number;
  settings: GroupSessionSettings;
}

export type GroupSessionStatus = 
  | 'active'
  | 'ordering'
  | 'checkout'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface GroupSessionSettings {
  allowGuestEdits: boolean;
  requireHostApproval: boolean;
  autoExpireAfterHours: number;
  maxOrdersPerPerson?: number;
}

export interface JoinSessionRequest {
  sessionId: string;
  participantName: string;
}

export interface SessionParticipantUpdate {
  sessionId: string;
  participantId: string;
  action: 'join' | 'leave' | 'update';
  data?: Partial<GroupParticipant>;
}

// Table service types
export interface TableInfo {
  number: number;
  id?: number; // EPOS Now TableID
  name?: string;
  seats?: number;
  status: 'available' | 'occupied' | 'needs-cleaning';
  area?: string;
}

export interface TableSession {
  tableNumber: number;
  startTime: Date;
  customerCount?: number;
  orders: string[]; // Order IDs
  status: 'active' | 'completed';
}

export interface CreateTableOrderRequest {
  items: CartItem[];
  customerDetails: CustomerDetails;
  tableNumber: number;
  collectionTime: string;
  notes?: string;
}