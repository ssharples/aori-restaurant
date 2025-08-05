interface EposNowConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

interface EposTransaction {
  Id: number;
  LocationId: number;
  TotalAmount: number;
  Status: string;
  CreatedDateTime: string;
  Note?: string;
  CustomerName?: string;
  CustomerPhone?: string;
  CustomerEmail?: string;
}

interface EposTransactionItem {
  TransactionId: number;
  ProductId: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  Notes?: string;
}

interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;
  totalAmount: number;
  collectionTime: Date;
  paymentMethod: 'online' | 'at-restaurant';
  notes?: string;
}

class EposNowAPI {
  private config: EposNowConfig;
  private authHeader: string;

  constructor(config: EposNowConfig) {
    this.config = config;
    // Create Basic Auth header
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

  async createOrder(orderData: CreateOrderRequest): Promise<{ transactionId: number; estimatedReadyTime: Date }> {
    try {
      // First, create the main transaction
      const transactionData = {
        LocationId: 1, // Default location ID - should be configured per restaurant
        TotalAmount: orderData.totalAmount,
        Status: 'Ordered', // EPOS Now status for new orders
        Note: `Collection: ${orderData.collectionTime.toISOString()}. Payment: ${orderData.paymentMethod}. ${orderData.notes || ''}`,
        CustomerName: orderData.customerName,
        CustomerPhone: orderData.customerPhone,
        CustomerEmail: orderData.customerEmail,
      };

      const transaction = await this.makeRequest<EposTransaction>('/api/v4/Transaction', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });

      // Then create transaction items
      for (const item of orderData.items) {
        const itemData = {
          TransactionId: transaction.Id,
          ProductName: item.productName,
          Quantity: item.quantity,
          UnitPrice: item.unitPrice,
          TotalPrice: item.unitPrice * item.quantity,
          Notes: item.notes,
        };

        await this.makeRequest<EposTransactionItem>('/api/v4/TransactionItem', {
          method: 'POST',
          body: JSON.stringify(itemData),
        });
      }

      // Calculate estimated ready time based on current queue
      const estimatedReadyTime = await this.calculateEstimatedTime(orderData.items, orderData.collectionTime);

      return {
        transactionId: transaction.Id,
        estimatedReadyTime,
      };
    } catch (error) {
      console.error('Failed to create order in EPOS Now:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  }

  async getOrderStatus(transactionId: number): Promise<{ status: string; estimatedReadyTime?: Date }> {
    try {
      const transaction = await this.makeRequest<EposTransaction>(`/api/v4/Transaction/${transactionId}`);
      
      return {
        status: this.mapEposStatusToOrderStatus(transaction.Status),
        // In a real implementation, you might parse estimated time from transaction notes
        // or have a separate system for tracking preparation times
      };
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  async getCurrentOrders(): Promise<EposTransaction[]> {
    try {
      // Get recent transactions with "Ordered" or "InProgress" status
      const response = await this.makeRequest<{ Results: EposTransaction[] }>('/api/v4/Transaction?$filter=Status eq \'Ordered\' or Status eq \'InProgress\'&$orderby=CreatedDateTime desc');
      return response.Results || [];
    } catch (error) {
      console.error('Failed to get current orders:', error);
      return [];
    }
  }

  private async calculateEstimatedTime(items: CreateOrderRequest['items'], preferredTime: Date): Promise<Date> {
    try {
      // Get current order queue
      const currentOrders = await this.getCurrentOrders();
      
      // Calculate base preparation time based on items
      const baseTime = this.calculateBasePreparationTime(items);
      
      // Calculate complexity factor
      const complexityFactor = Math.min(items.length * 1.2, 2.0);
      
      // Calculate current kitchen load
      const currentLoad = currentOrders.length;
      const loadFactor = Math.min(currentLoad * 2, 15); // Max 15 minutes extra
      
      // Total preparation time in minutes
      const totalMinutes = Math.ceil(baseTime * complexityFactor + loadFactor);
      
      const now = new Date();
      const estimatedTime = new Date(now.getTime() + totalMinutes * 60000);
      
      // If customer requested a specific time, use the later of estimated time or requested time
      return preferredTime > estimatedTime ? preferredTime : estimatedTime;
    } catch (error) {
      console.error('Failed to calculate estimated time:', error);
      // Fallback to simple calculation
      const fallbackMinutes = 15 + items.length * 2;
      return new Date(Date.now() + fallbackMinutes * 60000);
    }
  }

  private calculateBasePreparationTime(items: CreateOrderRequest['items']): number {
    // Base preparation times in minutes for different item types
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
      // Try to match item name to category for time estimation
      const category = this.categorizeItem(item.productName);
      const baseTime = baseTimes[category] || 5; // Default 5 minutes
      totalTime += baseTime * item.quantity;
    }

    return Math.max(totalTime, 10); // Minimum 10 minutes
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

// Environment configuration
const eposConfig: EposNowConfig = {
  apiKey: process.env.EPOS_NOW_API_KEY || '',
  apiSecret: process.env.EPOS_NOW_API_SECRET || '',
  baseUrl: process.env.EPOS_NOW_BASE_URL || 'https://api.eposnowhq.com',
};

export const eposAPI = new EposNowAPI(eposConfig);
export type { CreateOrderRequest, EposTransaction };