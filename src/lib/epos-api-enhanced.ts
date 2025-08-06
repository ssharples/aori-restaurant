// Enhanced EPOS Now API v4 Integration
// Comprehensive implementation of all EPOS Now capabilities

interface EposNowConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  locationId: number;
  webhookSecret?: string;
}

// Core EPOS entities
interface EposProduct {
  Id: number;
  Name: string;
  Description?: string;
  Price: number;
  CategoryId: number;
  BrandId?: number;
  SKU?: string;
  Barcode?: string;
  IsActive: boolean;
  StockQuantity?: number;
  MinStockLevel?: number;
  MaxStockLevel?: number;
  IsStockManaged: boolean;
  Image?: string;
  CreatedDateTime: string;
  UpdatedDateTime: string;
}

interface EposCategory {
  Id: number;
  Name: string;
  Description?: string;
  ParentCategoryId?: number;
  IsActive: boolean;
}

interface EposBrand {
  Id: number;
  Name: string;
  Description?: string;
  IsActive: boolean;
}

interface EposCustomer {
  Id: number;
  FirstName: string;
  LastName: string;
  Email?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  Address?: {
    Line1?: string;
    Line2?: string;
    City?: string;
    County?: string;
    PostCode?: string;
    Country?: string;
  };
  IsActive: boolean;
}

interface EposStock {
  Id: number;
  ProductId: number;
  LocationId: number;
  Quantity: number;
  MinStockLevel: number;
  MaxStockLevel: number;
  ReorderLevel: number;
  LastUpdated: string;
}

interface EposDiscount {
  Id: number;
  Name: string;
  Type: 'Percentage' | 'FixedAmount';
  Value: number;
  IsActive: boolean;
  ValidFrom?: string;
  ValidTo?: string;
  MinOrderValue?: number;
  MaxDiscountAmount?: number;
}

interface EposLocation {
  Id: number;
  Name: string;
  Address: {
    Line1?: string;
    Line2?: string;
    City?: string;
    County?: string;
    PostCode?: string;
    Country?: string;
  };
  PhoneNumber?: string;
  Email?: string;
  IsActive: boolean;
}

interface EposTransaction {
  Id: number;
  LocationId: number;
  TotalAmount: number;
  Status: string;
  CreatedDateTime: string;
  Note?: string;
  CustomerId?: number;
  CustomerName?: string;
  CustomerPhone?: string;
  CustomerEmail?: string;
  DiscountAmount?: number;
  TaxAmount?: number;
  SubTotal?: number;
}

interface EposTransactionItem {
  Id: number;
  TransactionId: number;
  ProductId?: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  DiscountAmount?: number;
  TaxAmount?: number;
  Notes?: string;
}

interface EposTender {
  Id: number;
  TransactionId: number;
  TenderTypeId: number;
  Amount: number;
  ChangeDue?: number;
  CardDetails?: {
    Last4: string;
    Brand: string;
    AuthCode?: string;
  };
  StripePaymentIntentId?: string;
}

// Webhook event interfaces
interface EposWebhookEvent {
  Id: string;
  EventType: string;
  EntityId: number;
  EntityType: string;
  Action: 'Create' | 'Update' | 'Delete';
  Timestamp: string;
  Data: Record<string, unknown>;
}

// Request/Response interfaces
interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerId?: number;
  items: Array<{
    productId?: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountId?: number;
    notes?: string;
  }>;
  totalAmount: number;
  collectionTime: Date;
  discountId?: number;
  notes?: string;
}

interface MenuSyncResult {
  products: EposProduct[];
  categories: EposCategory[];
  brands: EposBrand[];
  lastSyncTime: Date;
  totalSynced: number;
  errors: string[];
}

interface StockCheckResult {
  productId: number;
  productName: string;
  currentStock: number;
  minLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

class EnhancedEposNowAPI {
  private config: EposNowConfig;
  private authHeader: string;

  constructor(config: EposNowConfig) {
    this.config = config;
    const credentials = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EPOS Now API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // =============================================================================
  // PRODUCT & MENU MANAGEMENT
  // =============================================================================

  async syncMenuFromEpos(): Promise<MenuSyncResult> {
    try {
      const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        this.makeRequest<{ Results: EposProduct[] }>('/api/v4/Product?$filter=IsActive eq true'),
        this.makeRequest<{ Results: EposCategory[] }>('/api/v4/Category?$filter=IsActive eq true'),
        this.makeRequest<{ Results: EposBrand[] }>('/api/v4/Brand?$filter=IsActive eq true')
      ]);

      const products = productsResponse.Results || [];
      const categories = categoriesResponse.Results || [];
      const brands = brandsResponse.Results || [];

      return {
        products,
        categories,
        brands,
        lastSyncTime: new Date(),
        totalSynced: products.length + categories.length + brands.length,
        errors: []
      };
    } catch (error) {
      console.error('Menu sync failed:', error);
      throw new Error('Failed to sync menu from EPOS Now');
    }
  }

  async getProduct(productId: number): Promise<EposProduct> {
    return this.makeRequest<EposProduct>(`/api/v4/Product/${productId}`);
  }

  async createProduct(product: Partial<EposProduct>): Promise<EposProduct> {
    return this.makeRequest<EposProduct>('/api/v4/Product', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(productId: number, updates: Partial<EposProduct>): Promise<EposProduct> {
    return this.makeRequest<EposProduct>(`/api/v4/Product/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async getCategories(): Promise<EposCategory[]> {
    const response = await this.makeRequest<{ Results: EposCategory[] }>('/api/v4/Category');
    return response.Results || [];
  }

  async getBrands(): Promise<EposBrand[]> {
    const response = await this.makeRequest<{ Results: EposBrand[] }>('/api/v4/Brand');
    return response.Results || [];
  }

  // =============================================================================
  // STOCK & INVENTORY MANAGEMENT
  // =============================================================================

  async getStockLevels(productIds?: number[]): Promise<EposStock[]> {
    let endpoint = `/api/v4/ProductStock?$filter=LocationId eq ${this.config.locationId}`;
    
    if (productIds && productIds.length > 0) {
      const productFilter = productIds.map(id => `ProductId eq ${id}`).join(' or ');
      endpoint += ` and (${productFilter})`;
    }

    const response = await this.makeRequest<{ Results: EposStock[] }>(endpoint);
    return response.Results || [];
  }

  async updateStock(productId: number, quantity: number, reason?: string): Promise<void> {
    await this.makeRequest('/api/v4/StockTake', {
      method: 'POST',
      body: JSON.stringify({
        LocationId: this.config.locationId,
        ProductId: productId,
        Quantity: quantity,
        Reason: reason || 'Manual adjustment'
      })
    });
  }

  async checkLowStock(): Promise<StockCheckResult[]> {
    const stockLevels = await this.getStockLevels();
    const products = await this.syncMenuFromEpos();
    
    const results: StockCheckResult[] = [];
    
    for (const stock of stockLevels) {
      const product = products.products.find(p => p.Id === stock.ProductId);
      if (product) {
        results.push({
          productId: stock.ProductId,
          productName: product.Name,
          currentStock: stock.Quantity,
          minLevel: stock.MinStockLevel,
          isLowStock: stock.Quantity <= stock.MinStockLevel,
          isOutOfStock: stock.Quantity <= 0
        });
      }
    }
    
    return results.filter(r => r.isLowStock || r.isOutOfStock);
  }

  // =============================================================================
  // CUSTOMER MANAGEMENT
  // =============================================================================

  async findOrCreateCustomer(customerData: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  }): Promise<EposCustomer> {
    try {
      // First, try to find existing customer by phone or email
      let existingCustomer: EposCustomer | null = null;
      
      if (customerData.phoneNumber) {
        const phoneResponse = await this.makeRequest<{ Results: EposCustomer[] }>(
          `/api/v4/Customer?$filter=PhoneNumber eq '${customerData.phoneNumber}'`
        );
        existingCustomer = phoneResponse.Results?.[0] || null;
      }
      
      if (!existingCustomer && customerData.email) {
        const emailResponse = await this.makeRequest<{ Results: EposCustomer[] }>(
          `/api/v4/Customer?$filter=Email eq '${customerData.email}'`
        );
        existingCustomer = emailResponse.Results?.[0] || null;
      }
      
      if (existingCustomer) {
        return existingCustomer;
      }
      
      // Create new customer
      return await this.makeRequest<EposCustomer>('/api/v4/Customer', {
        method: 'POST',
        body: JSON.stringify({
          FirstName: customerData.firstName,
          LastName: customerData.lastName,
          Email: customerData.email,
          PhoneNumber: customerData.phoneNumber,
          IsActive: true
        })
      });
    } catch (error) {
      console.error('Customer management failed:', error);
      throw new Error('Failed to manage customer data');
    }
  }

  // =============================================================================
  // DISCOUNT MANAGEMENT
  // =============================================================================

  async getActiveDiscounts(): Promise<EposDiscount[]> {
    const now = new Date().toISOString();
    const response = await this.makeRequest<{ Results: EposDiscount[] }>(
      `/api/v4/Discount?$filter=IsActive eq true and (ValidFrom eq null or ValidFrom le '${now}') and (ValidTo eq null or ValidTo ge '${now}')`
    );
    return response.Results || [];
  }

  async applyDiscount(discountId: number, orderTotal: number): Promise<{ discountAmount: number; finalTotal: number }> {
    const discount = await this.makeRequest<EposDiscount>(`/api/v4/Discount/${discountId}`);
    
    if (!discount.IsActive) {
      throw new Error('Discount is not active');
    }
    
    if (discount.MinOrderValue && orderTotal < discount.MinOrderValue) {
      throw new Error(`Minimum order value of £${discount.MinOrderValue} required`);
    }
    
    let discountAmount = 0;
    if (discount.Type === 'Percentage') {
      discountAmount = orderTotal * (discount.Value / 100);
    } else {
      discountAmount = discount.Value;
    }
    
    if (discount.MaxDiscountAmount && discountAmount > discount.MaxDiscountAmount) {
      discountAmount = discount.MaxDiscountAmount;
    }
    
    return {
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalTotal: Math.round((orderTotal - discountAmount) * 100) / 100
    };
  }

  // =============================================================================
  // ORDER MANAGEMENT (Enhanced)
  // =============================================================================

  async createOrder(orderData: CreateOrderRequest): Promise<{ 
    transactionId: number; 
    estimatedReadyTime: Date;
    customer?: EposCustomer;
    finalTotal: number;
  }> {
    try {
      let customer: EposCustomer | undefined;
      let finalTotal = orderData.totalAmount;
      let discountAmount = 0;

      // Handle customer creation/lookup
      if (orderData.customerName && orderData.customerPhone) {
        const [firstName, ...lastNameParts] = orderData.customerName.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        customer = await this.findOrCreateCustomer({
          firstName,
          lastName,
          email: orderData.customerEmail,
          phoneNumber: orderData.customerPhone
        });
      }

      // Apply discount if provided
      if (orderData.discountId) {
        const discountResult = await this.applyDiscount(orderData.discountId, orderData.totalAmount);
        discountAmount = discountResult.discountAmount;
        finalTotal = discountResult.finalTotal;
      }

      // Create main transaction
      const transactionData: Partial<EposTransaction> = {
        LocationId: this.config.locationId,
        TotalAmount: finalTotal,
        Status: 'Ordered',
        Note: `Collection: ${orderData.collectionTime.toISOString()}. Payment: Pay on Collection. ${orderData.notes || ''}`,
        CustomerId: customer?.Id,
        CustomerName: orderData.customerName,
        CustomerPhone: orderData.customerPhone,
        CustomerEmail: orderData.customerEmail,
        DiscountAmount: discountAmount,
        SubTotal: orderData.totalAmount
      };

      const transaction = await this.makeRequest<EposTransaction>('/api/v4/Transaction', {
        method: 'POST',
        body: JSON.stringify(transactionData)
      });

      // Create transaction items
      for (const item of orderData.items) {
        const itemData: Partial<EposTransactionItem> = {
          TransactionId: transaction.Id,
          ProductId: item.productId,
          ProductName: item.productName,
          Quantity: item.quantity,
          UnitPrice: item.unitPrice,
          TotalPrice: item.unitPrice * item.quantity,
          Notes: item.notes
        };

        await this.makeRequest<EposTransactionItem>('/api/v4/TransactionItem', {
          method: 'POST',
          body: JSON.stringify(itemData)
        });
      }

      // Payment will be handled at collection time
      // No payment tender created for advance orders

      // Calculate estimated ready time
      const estimatedReadyTime = await this.calculateEstimatedTime(orderData.items, orderData.collectionTime);

      return {
        transactionId: transaction.Id,
        estimatedReadyTime,
        customer,
        finalTotal
      };

    } catch (error) {
      console.error('Enhanced order creation failed:', error);
      throw new Error('Failed to create order with enhanced features');
    }
  }

  // Create payment tender when customer pays at collection
  async createCollectionPaymentTender(transactionId: number, amount: number, tenderType: 'cash' | 'card'): Promise<EposTender> {
    return this.makeRequest<EposTender>('/api/v4/Tender', {
      method: 'POST',
      body: JSON.stringify({
        TransactionId: transactionId,
        TenderTypeId: tenderType === 'cash' ? 1 : 2, // 1 = Cash, 2 = Card
        Amount: amount
      })
    });
  }

  async updateOrderStatus(transactionId: number, status: string): Promise<void> {
    await this.makeRequest(`/api/v4/Transaction/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify({ Status: status })
    });
  }

  async getOrderStatus(transactionId: number): Promise<{ 
    status: string; 
    estimatedReadyTime?: Date;
    transaction: EposTransaction;
    items: EposTransactionItem[];
  }> {
    try {
      const [transaction, itemsResponse] = await Promise.all([
        this.makeRequest<EposTransaction>(`/api/v4/Transaction/${transactionId}`),
        this.makeRequest<{ Results: EposTransactionItem[] }>(`/api/v4/TransactionItem?$filter=TransactionId eq ${transactionId}`)
      ]);
      
      return {
        status: this.mapEposStatusToOrderStatus(transaction.Status),
        transaction,
        items: itemsResponse.Results || []
      };
    } catch (error) {
      console.error('Failed to get enhanced order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  async getCurrentOrders(): Promise<EposTransaction[]> {
    try {
      const response = await this.makeRequest<{ Results: EposTransaction[] }>(
        `/api/v4/Transaction?$filter=LocationId eq ${this.config.locationId} and (Status eq 'Ordered' or Status eq 'InProgress')&$orderby=CreatedDateTime desc`
      );
      return response.Results || [];
    } catch (error) {
      console.error('Failed to get current orders:', error);
      return [];
    }
  }

  // =============================================================================
  // LOCATION MANAGEMENT
  // =============================================================================

  async getLocations(): Promise<EposLocation[]> {
    const response = await this.makeRequest<{ Results: EposLocation[] }>('/api/v4/Location');
    return response.Results || [];
  }

  async getCurrentLocation(): Promise<EposLocation> {
    return this.makeRequest<EposLocation>(`/api/v4/Location/${this.config.locationId}`);
  }

  // =============================================================================
  // WEBHOOK VALIDATION
  // =============================================================================

  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    if (!this.config.webhookSecret) {
      console.warn('Webhook secret not configured');
      return false;
    }

    try {
      // EPOS Now webhook signature validation
      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }

  parseWebhookEvent(payload: string): EposWebhookEvent {
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new Error(`Invalid webhook payload: ${error}`);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private async calculateEstimatedTime(items: CreateOrderRequest['items'], preferredTime: Date): Promise<Date> {
    try {
      const currentOrders = await this.getCurrentOrders();
      const baseTime = this.calculateBasePreparationTime(items);
      const complexityFactor = Math.min(items.length * 1.2, 2.0);
      const currentLoad = currentOrders.length;
      const loadFactor = Math.min(currentLoad * 2, 15);
      
      const totalMinutes = Math.ceil(baseTime * complexityFactor + loadFactor);
      const now = new Date();
      const estimatedTime = new Date(now.getTime() + totalMinutes * 60000);
      
      return preferredTime > estimatedTime ? preferredTime : estimatedTime;
    } catch (error) {
      console.error('Failed to calculate estimated time:', error);
      const fallbackMinutes = 15 + items.length * 2;
      return new Date(Date.now() + fallbackMinutes * 60000);
    }
  }

  private calculateBasePreparationTime(items: CreateOrderRequest['items']): number {
    const baseTimes: { [key: string]: number } = {
      gyros: 8,
      souvlaki: 10,
      'bao-bun': 6,
      salad: 3,
      'pita-dips': 2,
      sides: 3,
      desserts: 1,
      drinks: 0.5,
    };

    let totalTime = 0;
    for (const item of items) {
      const category = this.categorizeItem(item.productName);
      const baseTime = baseTimes[category] || 5;
      totalTime += baseTime * item.quantity;
    }

    return Math.max(totalTime, 10);
  }

  private categorizeItem(productName: string): string {
    const name = productName.toLowerCase();
    if (name.includes('gyros')) return 'gyros';
    if (name.includes('souvlaki')) return 'souvlaki';
    if (name.includes('bao')) return 'bao-bun';
    if (name.includes('salad')) return 'salad';
    if (name.includes('tzatziki') || name.includes('hummus') || name.includes('dip')) return 'pita-dips';
    if (name.includes('chips') || name.includes('halloumi') || name.includes('pita') || name.includes('olives')) return 'sides';
    if (name.includes('ferrero') || name.includes('profiterole') || name.includes('tiramisu')) return 'desserts';
    if (name.includes('coke') || name.includes('sprite') || name.includes('fanta') || name.includes('water') || name.includes('juice')) return 'drinks';
    return 'unknown';
  }

  private mapEposStatusToOrderStatus(eposStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'Ordered': 'confirmed',
      'InProgress': 'preparing',
      'Ready': 'ready',
      'Complete': 'collected',
      'Cancelled': 'cancelled',
    };

    return statusMap[eposStatus] || 'pending';
  }
}

// Environment configuration with enhanced settings
const enhancedEposConfig: EposNowConfig = {
  apiKey: process.env.EPOS_NOW_API_KEY || '',
  apiSecret: process.env.EPOS_NOW_API_SECRET || '',
  baseUrl: process.env.EPOS_NOW_BASE_URL || 'https://api.eposnowhq.com',
  locationId: parseInt(process.env.EPOS_NOW_LOCATION_ID || '1'),
  webhookSecret: process.env.EPOS_NOW_WEBHOOK_SECRET
};

export const enhancedEposAPI = new EnhancedEposNowAPI(enhancedEposConfig);
export type { 
  EposProduct, 
  EposCategory, 
  EposBrand, 
  EposCustomer, 
  EposStock, 
  EposDiscount,
  EposLocation,
  EposTransaction,
  EposTransactionItem,
  EposTender,
  EposWebhookEvent,
  CreateOrderRequest, 
  MenuSyncResult,
  StockCheckResult
};