import { NextRequest, NextResponse } from 'next/server';
import { enhancedEposAPI } from '@/lib/epos-api-enhanced';
import { stockTrackingService } from '@/lib/stock-tracking';
import { menuSyncService } from '@/lib/menu-sync';

// Admin Dashboard API - Comprehensive EPOS management endpoint

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'overview';

    switch (section) {
      case 'overview':
        return await getDashboardOverview();
      
      case 'orders':
        return await getOrdersDashboard();
      
      case 'inventory':
        return await getInventoryDashboard();
      
      case 'customers':
        return await getCustomersDashboard();
      
      case 'menu':
        return await getMenuDashboard();
      
      case 'sales':
        return await getSalesDashboard();
      
      case 'discounts':
        return await getDiscountsDashboard();
      
      default:
        return NextResponse.json(
          { error: 'Invalid dashboard section' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Dashboard overview with key metrics
async function getDashboardOverview() {
  try {
    // Get current orders
    const currentOrders = await enhancedEposAPI.getCurrentOrders();
    
    // Get stock summary
    const stockSummary = stockTrackingService.getStockSummary();
    
    // Get menu sync status
    const menuSyncStatus = menuSyncService.getSyncStatus();
    
    // Get recent webhook events (from global state)
    const recentEvents = getRecentWebhookEvents();

    // Calculate today's metrics
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todaysOrders = currentOrders.filter(order => 
      new Date(order.CreatedDateTime) >= todayStart
    );

    const overview = {
      summary: {
        activeOrders: currentOrders.length,
        todaysOrders: todaysOrders.length,
        totalRevenue: todaysOrders.reduce((sum, order) => sum + order.TotalAmount, 0),
        averageOrderValue: todaysOrders.length > 0 
          ? todaysOrders.reduce((sum, order) => sum + order.TotalAmount, 0) / todaysOrders.length 
          : 0
      },
      stock: {
        totalAlerts: stockSummary.totalAlerts,
        criticalAlerts: stockSummary.criticalAlerts,
        outOfStock: stockSummary.outOfStock,
        lowStock: stockSummary.lowStock
      },
      menu: {
        lastSync: menuSyncStatus.lastSync,
        syncInProgress: menuSyncStatus.inProgress,
        nextScheduledSync: menuSyncStatus.nextScheduledSync
      },
      system: {
        recentEvents: recentEvents.length,
        webhooksActive: true,
        apiStatus: 'healthy'
      }
    };

    return NextResponse.json({
      success: true,
      overview,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get dashboard overview:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard overview' },
      { status: 500 }
    );
  }
}

// Orders dashboard with detailed order management
async function getOrdersDashboard() {
  try {
    const currentOrders = await enhancedEposAPI.getCurrentOrders();
    
    // Get detailed order information
    const detailedOrders = await Promise.all(
      currentOrders.map(async (order) => {
        try {
          const orderDetails = await enhancedEposAPI.getOrderStatus(order.Id);
          return {
            ...order,
            items: orderDetails.items,
            status: orderDetails.status
          };
        } catch (error) {
          console.error(`Failed to get details for order ${order.Id}:`, error);
          return order;
        }
      })
    );

    // Group orders by status
    const ordersByStatus = {
      ordered: detailedOrders.filter(order => order.Status === 'Ordered'),
      inProgress: detailedOrders.filter(order => order.Status === 'InProgress'),
      ready: detailedOrders.filter(order => order.Status === 'Ready'),
      completed: detailedOrders.filter(order => order.Status === 'Complete')
    };

    // Calculate preparation times
    const avgPreparationTime = calculateAveragePreparationTime(detailedOrders);

    return NextResponse.json({
      success: true,
      orders: {
        total: detailedOrders.length,
        byStatus: ordersByStatus,
        averagePreparationTime: avgPreparationTime,
        queue: detailedOrders.filter(order => 
          order.Status === 'Ordered' || order.Status === 'InProgress'
        ).sort((a, b) => 
          new Date(a.CreatedDateTime).getTime() - new Date(b.CreatedDateTime).getTime()
        )
      }
    });

  } catch (error) {
    console.error('Failed to get orders dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load orders dashboard' },
      { status: 500 }
    );
  }
}

// Inventory dashboard with stock management
async function getInventoryDashboard() {
  try {
    const inventoryReport = await stockTrackingService.generateInventoryReport();
    const stockSummary = stockTrackingService.getStockSummary();
    
    return NextResponse.json({
      success: true,
      inventory: {
        summary: stockSummary,
        report: inventoryReport,
        alerts: stockTrackingService.getActiveAlerts(),
        recentMovements: stockTrackingService.getRecentMovements(20)
      }
    });

  } catch (error) {
    console.error('Failed to get inventory dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load inventory dashboard' },
      { status: 500 }
    );
  }
}

// Customer management dashboard
async function getCustomersDashboard() {
  try {
    // Get recent customers from recent orders
    const recentOrders = await enhancedEposAPI.getCurrentOrders();
    
    const customers = recentOrders
      .filter(order => order.CustomerId)
      .map(order => ({
        id: order.CustomerId,
        name: order.CustomerName,
        phone: order.CustomerPhone,
        email: order.CustomerEmail,
        lastOrderDate: order.CreatedDateTime,
        totalSpent: order.TotalAmount
      }));

    // Remove duplicates and aggregate data
    const uniqueCustomers = customers.reduce((acc, customer) => {
      const existing = acc.find(c => c.id === customer.id);
      if (existing) {
        existing.totalSpent += customer.totalSpent;
        if (new Date(customer.lastOrderDate) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = customer.lastOrderDate;
        }
      } else {
        acc.push(customer);
      }
      return acc;
    }, [] as any[]);

    return NextResponse.json({
      success: true,
      customers: {
        total: uniqueCustomers.length,
        recent: uniqueCustomers.sort((a, b) => 
          new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
        ).slice(0, 20),
        topSpenders: uniqueCustomers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Failed to get customers dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load customers dashboard' },
      { status: 500 }
    );
  }
}

// Menu management dashboard
async function getMenuDashboard() {
  try {
    const syncStatus = menuSyncService.getSyncStatus();
    
    // Get menu sync information
    const menuSync = await menuSyncService.syncMenu({ forceSync: false });

    return NextResponse.json({
      success: true,
      menu: {
        syncStatus,
        lastSync: menuSync.success ? menuSync : null,
        categories: [], // Would be populated from actual menu data
        products: [], // Would be populated from actual menu data
        syncHistory: [] // Would track sync history
      }
    });

  } catch (error) {
    console.error('Failed to get menu dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load menu dashboard' },
      { status: 500 }
    );
  }
}

// Sales dashboard (payment handled at collection)
async function getSalesDashboard() {
  try {
    // Get sales-related orders
    const recentOrders = await enhancedEposAPI.getCurrentOrders();
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todaysSales = recentOrders.filter(order => 
      new Date(order.CreatedDateTime) >= todayStart
    );

    const salesSummary = {
      totalToday: todaysSales.reduce((sum, order) => sum + order.TotalAmount, 0),
      orderCount: todaysSales.length,
      averageOrderValue: todaysSales.length > 0 
        ? todaysSales.reduce((sum, order) => sum + order.TotalAmount, 0) / todaysSales.length 
        : 0,
      pendingCollection: todaysSales.filter(order => order.Status === 'Ordered' || order.Status === 'InProgress').length,
      completedOrders: todaysSales.filter(order => order.Status === 'Complete').length
    };

    return NextResponse.json({
      success: true,
      sales: {
        summary: salesSummary,
        recent: todaysSales.slice(0, 20),
        paymentNote: 'All payments handled at collection via EPOS Now POS system'
      }
    });

  } catch (error) {
    console.error('Failed to get sales dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load sales dashboard' },
      { status: 500 }
    );
  }
}

// Discounts management dashboard
async function getDiscountsDashboard() {
  try {
    const activeDiscounts = await enhancedEposAPI.getActiveDiscounts();
    
    return NextResponse.json({
      success: true,
      discounts: {
        active: activeDiscounts,
        total: activeDiscounts.length,
        usage: [], // Would track discount usage statistics
        revenue: 0 // Would calculate revenue impact
      }
    });

  } catch (error) {
    console.error('Failed to get discounts dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load discounts dashboard' },
      { status: 500 }
    );
  }
}

// Helper functions
function getRecentWebhookEvents(): any[] {
  // Get recent events from global state (set by webhook handlers)
  if (typeof global !== 'undefined') {
    const events = [
      ...(global.kitchenUpdates || []),
      ...(global.orderUpdates || []),
      ...(global.stockAlerts || []),
      ...(global.discountUpdates || [])
    ];
    
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }
  
  return [];
}

function calculateAveragePreparationTime(orders: any[]): number {
  const completedOrders = orders.filter(order => 
    order.Status === 'Complete' && order.CreatedDateTime
  );
  
  if (completedOrders.length === 0) return 0;
  
  const totalTime = completedOrders.reduce((sum, order) => {
    const created = new Date(order.CreatedDateTime);
    const now = new Date();
    return sum + (now.getTime() - created.getTime());
  }, 0);
  
  return Math.round(totalTime / completedOrders.length / 1000 / 60); // Minutes
}

// POST endpoint for admin actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'sync_menu':
        const syncResult = await menuSyncService.syncMenu({ forceSync: true });
        return NextResponse.json({ success: true, result: syncResult });
      
      case 'update_order_status':
        await enhancedEposAPI.updateOrderStatus(data.orderId, data.status);
        return NextResponse.json({ success: true });
      
      case 'acknowledge_stock_alert':
        const acknowledged = stockTrackingService.acknowledgeAlert(data.alertId);
        return NextResponse.json({ success: acknowledged });
      
      case 'record_stock_movement':
        await stockTrackingService.recordStockMovement(
          data.productId,
          data.movementType,
          data.quantity,
          data.reason,
          data.userId
        );
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin action failed:', error);
    return NextResponse.json(
      { error: 'Action failed' },
      { status: 500 }
    );
  }
}