import { NextResponse } from 'next/server';
import { enhancedEposAPI } from '@/lib/epos-api-enhanced';
import { stockTrackingService } from '@/lib/stock-tracking';

export async function GET() {
  try {
    // Get current orders from enhanced EPOS Now integration
    const currentOrders = await enhancedEposAPI.getCurrentOrders();
    
    // Get stock alerts for kitchen awareness
    const stockAlerts = stockTrackingService.getActiveAlerts();
    const criticalAlerts = stockAlerts.filter(alert => alert.severity === 'critical');
    
    // Calculate kitchen metrics
    const activeOrders = currentOrders.length;
    const averageWaitTime = Math.min(activeOrders * 3, 25); // 3 minutes per order, max 25 minutes
    
    // Determine kitchen status
    let status: 'quiet' | 'busy' | 'very-busy' = 'quiet';
    if (activeOrders >= 10) {
      status = 'very-busy';
    } else if (activeOrders >= 5) {
      status = 'busy';
    }

    // Calculate estimated collection time for new orders
    const baseTime = 15; // Base preparation time
    const loadFactor = Math.min(activeOrders * 2, 15); // Additional time based on load
    const estimatedMinutes = baseTime + loadFactor;
    const estimatedCollectionTime = new Date(Date.now() + estimatedMinutes * 60000);

    return NextResponse.json({
      success: true,
      kitchenStatus: {
        status,
        activeOrders,
        averageWaitTime,
        estimatedCollectionTime: estimatedCollectionTime.toISOString(),
        estimatedMinutes,
        stockAlerts: {
          total: stockAlerts.length,
          critical: criticalAlerts.length,
          outOfStock: stockAlerts.filter(alert => alert.alertType === 'OUT_OF_STOCK').length
        },
        orderQueue: currentOrders.slice(0, 10) // First 10 orders in queue
      }
    });

  } catch (error) {
    console.error('Failed to get kitchen status:', error);
    
    // Return fallback data if EPOS integration fails
    return NextResponse.json({
      success: true,
      kitchenStatus: {
        status: 'quiet' as const,
        activeOrders: 0,
        averageWaitTime: 15,
        estimatedCollectionTime: new Date(Date.now() + 15 * 60000).toISOString(),
        estimatedMinutes: 15,
      }
    });
  }
}