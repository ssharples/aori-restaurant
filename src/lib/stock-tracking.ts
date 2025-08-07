// Stock Tracking and Inventory Management
// Real-time inventory monitoring with EPOS Now integration

import { enhancedEposAPI } from './epos-api-enhanced';
import type { StockCheckResult } from './epos-api-enhanced';

// Note: stockAlerts global is declared in webhooks/epos/route.ts

interface StockAlert {
  id: string;
  productId: number;
  productName: string;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'REORDER_NEEDED';
  currentStock: number;
  minStock: number;
  reorderLevel: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
}

interface StockMovement {
  id: string;
  productId: number;
  productName: string;
  movementType: 'SALE' | 'WASTE' | 'ADJUSTMENT' | 'DELIVERY' | 'RETURN';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: Date;
  userId?: string;
}

interface InventoryReport {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
  alerts: StockAlert[];
  recentMovements: StockMovement[];
  generatedAt: Date;
}

class StockTrackingService {
  private stockAlerts: StockAlert[] = [];
  private stockMovements: StockMovement[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly MONITORING_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.loadStoredData();
  }

  // Start continuous stock monitoring
  startMonitoring(): void {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    console.log('Starting stock monitoring...');
    
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkStockLevels();
      } catch (error) {
        console.error('Stock monitoring error:', error);
      }
    }, this.MONITORING_INTERVAL);

    // Initial check
    this.checkStockLevels().catch(console.error);
  }

  // Stop stock monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Stock monitoring stopped');
    }
  }

  // Check all stock levels and generate alerts
  async checkStockLevels(): Promise<StockCheckResult[]> {
    try {
      console.log('Checking stock levels...');
      
      const lowStockItems = await enhancedEposAPI.checkLowStock();
      
      // Process each low stock item
      for (const item of lowStockItems) {
        await this.processStockAlert(item);
      }

      // Clean up old alerts
      this.cleanupOldAlerts();

      // Store updated data
      this.storeData();

      console.log(`Stock check completed: ${lowStockItems.length} items need attention`);
      return lowStockItems;

    } catch (error) {
      console.error('Failed to check stock levels:', error);
      return [];
    }
  }

  // Process individual stock alert
  private async processStockAlert(stockItem: StockCheckResult): Promise<void> {
    const alertType = stockItem.isOutOfStock ? 'OUT_OF_STOCK' : 'LOW_STOCK';
    const severity = this.calculateAlertSeverity(stockItem);

    // Check if we already have this alert
    const existingAlert = this.stockAlerts.find(
      alert => alert.productId === stockItem.productId && alert.alertType === alertType
    );

    if (existingAlert) {
      // Update existing alert
      existingAlert.currentStock = stockItem.currentStock;
      existingAlert.timestamp = new Date();
      existingAlert.severity = severity;
    } else {
      // Create new alert
      const newAlert: StockAlert = {
        id: `alert_${stockItem.productId}_${Date.now()}`,
        productId: stockItem.productId,
        productName: stockItem.productName,
        alertType,
        currentStock: stockItem.currentStock,
        minStock: stockItem.minLevel,
        reorderLevel: stockItem.minLevel * 2, // Simple reorder calculation
        severity,
        timestamp: new Date(),
        acknowledged: false
      };

      this.stockAlerts.unshift(newAlert);

      // Trigger notifications for critical alerts
      if (severity === 'critical') {
        await this.sendCriticalStockAlert(newAlert);
      }
    }

    // Limit alerts array size
    if (this.stockAlerts.length > 100) {
      this.stockAlerts = this.stockAlerts.slice(0, 100);
    }
  }

  // Calculate alert severity based on stock levels
  private calculateAlertSeverity(stockItem: StockCheckResult): 'low' | 'medium' | 'high' | 'critical' {
    if (stockItem.isOutOfStock) {
      return 'critical';
    }

    const stockRatio = stockItem.currentStock / stockItem.minLevel;
    
    if (stockRatio <= 0.5) {
      return 'high';
    } else if (stockRatio <= 0.75) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Record stock movement
  async recordStockMovement(
    productId: number,
    movementType: StockMovement['movementType'],
    quantity: number,
    reason?: string,
    userId?: string
  ): Promise<void> {
    try {
      // Get current stock level
      const stockLevels = await enhancedEposAPI.getStockLevels([productId]);
      const currentStock = stockLevels[0]?.Quantity || 0;
      
      // Get product name
      let productName = `Product ${productId}`;
      try {
        const product = await enhancedEposAPI.getProduct(productId);
        productName = product.Name;
      } catch {
        console.warn(`Failed to get product name for ${productId}`);
      }

      const movement: StockMovement = {
        id: `movement_${productId}_${Date.now()}`,
        productId,
        productName,
        movementType,
        quantity,
        previousStock: currentStock,
        newStock: currentStock + (movementType === 'SALE' || movementType === 'WASTE' ? -quantity : quantity),
        reason,
        timestamp: new Date(),
        userId
      };

      this.stockMovements.unshift(movement);

      // Limit movements array size
      if (this.stockMovements.length > 500) {
        this.stockMovements = this.stockMovements.slice(0, 500);
      }

      // Update EPOS stock if it's an adjustment
      if (movementType === 'ADJUSTMENT' || movementType === 'DELIVERY') {
        await enhancedEposAPI.updateStock(productId, movement.newStock, reason);
      }

      this.storeData();

      console.log(`Stock movement recorded: ${productName} ${movementType} ${quantity}`);

    } catch (error) {
      console.error('Failed to record stock movement:', error);
      throw error;
    }
  }

  // Generate inventory report
  async generateInventoryReport(): Promise<InventoryReport> {
    try {
      const stockLevels = await enhancedEposAPI.getStockLevels();
      const lowStockItems = await enhancedEposAPI.checkLowStock();

      const outOfStockCount = lowStockItems.filter(item => item.isOutOfStock).length;
      const lowStockCount = lowStockItems.filter(item => item.isLowStock && !item.isOutOfStock).length;

      // Calculate total inventory value (simplified)
      let totalValue = 0;
      for (const stock of stockLevels) {
        try {
          const product = await enhancedEposAPI.getProduct(stock.ProductId);
          totalValue += stock.Quantity * product.Price;
        } catch {
          // Skip if product not found
        }
      }

      const report: InventoryReport = {
        totalProducts: stockLevels.length,
        lowStockCount,
        outOfStockCount,
        totalValue: Math.round(totalValue * 100) / 100,
        alerts: this.getActiveAlerts(),
        recentMovements: this.getRecentMovements(50),
        generatedAt: new Date()
      };

      return report;

    } catch (error) {
      console.error('Failed to generate inventory report:', error);
      throw error;
    }
  }

  // Get active stock alerts
  getActiveAlerts(): StockAlert[] {
    return this.stockAlerts.filter(alert => !alert.acknowledged);
  }

  // Get recent stock movements
  getRecentMovements(limit: number = 20): StockMovement[] {
    return this.stockMovements.slice(0, limit);
  }

  // Acknowledge stock alert
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.stockAlerts.find(alert => alert.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.storeData();
      return true;
    }
    return false;
  }

  // Dismiss multiple alerts
  dismissAlerts(alertIds: string[]): number {
    let dismissed = 0;
    for (const id of alertIds) {
      if (this.acknowledgeAlert(id)) {
        dismissed++;
      }
    }
    return dismissed;
  }

  // Get stock summary for dashboard
  getStockSummary(): {
    totalAlerts: number;
    criticalAlerts: number;
    outOfStock: number;
    lowStock: number;
    recentMovements: number;
  } {
    const activeAlerts = this.getActiveAlerts();
    
    return {
      totalAlerts: activeAlerts.length,
      criticalAlerts: activeAlerts.filter(alert => alert.severity === 'critical').length,
      outOfStock: activeAlerts.filter(alert => alert.alertType === 'OUT_OF_STOCK').length,
      lowStock: activeAlerts.filter(alert => alert.alertType === 'LOW_STOCK').length,
      recentMovements: this.stockMovements.filter(
        movement => movement.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    };
  }

  // Clean up old alerts (older than 7 days and acknowledged)
  private cleanupOldAlerts(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    this.stockAlerts = this.stockAlerts.filter(alert => {
      return !alert.acknowledged || alert.timestamp > sevenDaysAgo;
    });
  }

  // Send critical stock alert notification
  private async sendCriticalStockAlert(alert: StockAlert): Promise<void> {
    try {
      console.log(`🚨 CRITICAL STOCK ALERT: ${alert.productName} is ${alert.alertType.toLowerCase()}`);
      
      // In a real implementation, you would send:
      // - Email notifications to managers
      // - SMS alerts for critical items
      // - Push notifications to mobile apps
      // - Slack/Teams messages
      
      // For now, just log and store in global alerts for webhooks
      if (typeof global !== 'undefined') {
        global.stockAlerts = global.stockAlerts || [];
        global.stockAlerts.push({
          type: 'CRITICAL_STOCK_ALERT',
          productId: alert.productId,
          productName: alert.productName,
          alertType: alert.alertType,
          currentStock: alert.currentStock,
          severity: alert.severity,
          timestamp: alert.timestamp.toISOString()
        });
      }

    } catch (error) {
      console.error('Failed to send critical stock alert:', error);
    }
  }

  // Data persistence methods
  private loadStoredData(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedAlerts = localStorage.getItem('stock_alerts');
        const storedMovements = localStorage.getItem('stock_movements');
        
        if (storedAlerts) {
          this.stockAlerts = JSON.parse(storedAlerts).map((alert: { timestamp: string }) => ({
            ...alert,
            timestamp: new Date(alert.timestamp)
          }));
        }
        
        if (storedMovements) {
          this.stockMovements = JSON.parse(storedMovements).map((movement: { timestamp: string }) => ({
            ...movement,
            timestamp: new Date(movement.timestamp)
          }));
        }
      } catch (error) {
        console.error('Failed to load stored stock data:', error);
      }
    }
  }

  private storeData(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('stock_alerts', JSON.stringify(this.stockAlerts));
        localStorage.setItem('stock_movements', JSON.stringify(this.stockMovements));
      } catch (error) {
        console.error('Failed to store stock data:', error);
      }
    }
  }
}

// Singleton instance
export const stockTrackingService = new StockTrackingService();

// Auto-start monitoring in production
if (process.env.NODE_ENV === 'production') {
  stockTrackingService.startMonitoring();
}

export type { StockAlert, StockMovement, InventoryReport };