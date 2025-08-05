import { NextResponse } from 'next/server';
import { eposAPI } from '@/lib/epos-api';

export async function GET() {
  try {
    // Get current orders from EPOS Now
    const currentOrders = await eposAPI.getCurrentOrders();
    
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